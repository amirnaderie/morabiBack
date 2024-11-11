import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MulterFile } from '../fileOptions';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { In, Repository } from 'typeorm';
import { UtilityService } from 'src/utility/providers/utility.service';
import { join } from 'path';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  ReadStream,
  unlink,
} from 'fs';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities/user.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { FFmpegService } from './ffmpeg.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import * as mime from 'mime-types';
import { LogService } from 'src/modules/log/providers/log.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly utilityService: UtilityService,
    private readonly configService: ConfigService,
    private readonly ffmpegService: FFmpegService,
    private readonly logService: LogService,
  ) {}

  async handleFileUpload(
    file: MulterFile,
    req: Request,
    user: User,
    movement?: Movement,
  ): Promise<{ data: File | File[] }> {
    if (!file) {
      const errorMessage = req['fileValidationError'] || 'File upload failed';
      throw new BadRequestException(errorMessage);
    }

    const isVideo = this.configService
      .get<string>('VIDEO_ALLOWD_MIMETYPES')
      .split(',')
      .includes(file.mimetype);
    const isImage = this.configService
      .get<string>('IMAGE_ALLOWD_MIMETYPES')
      .split(',')
      .includes(file.mimetype);

    if (!isImage && !isVideo) {
      throw new BadRequestException('فرمت فایل صحیح نمی باشد');
    }
    if (
      file.originalname.length >
      parseFloat(this.configService.get<string>('FILE_SIZE_IMAGE'))
    ) {
      throw new BadRequestException(
        `${parseFloat(this.configService.get<string>('FILE_SIZE_IMAGE')) / 1048576}MB حداکثر حجم قابل پذیریش برای این فایل برابر است با`,
      );
    }
    if (
      file.originalname.length >
      parseFloat(this.configService.get<string>('FILE_SIZE_VIDEO'))
    ) {
      throw new BadRequestException(
        `${parseFloat(this.configService.get<string>('FILE_SIZE_VIDEO')) / 1048576}MB حداکثر حجم قابل پذیریش برای این فایل برابر است با`,
      );
    }
    if (
      file.size >
        parseFloat(this.configService.get<string>('FILE_SIZE_IMAGE')) ||
      file.size > parseFloat(this.configService.get<string>('FILE_SIZE_VIDEO'))
    ) {
      throw new BadRequestException('نام فایل طولانی می باشد');
    }

    if (!this.utilityService.onlyLettersAndNumbers(file.originalname)) {
      throw new BadRequestException('نام فایل حاوی کاراکترهای غیر مجاز است');
    }

    const filename = `${Date.now()}-${file.originalname}`;

    const mimetype = file.mimetype;

    // const filePath = join(__dirname, '..', '..', 'uploads', filename);

    if (!existsSync(join(__dirname, '..', '..', 'uploads'))) {
      mkdirSync(join(__dirname, '..', '..', 'uploads'));
    }
    // writeFileSync(filePath, file.buffer); // Save the file manually

    const newFile = this.fileRepository.create({
      fileName: filename,
      mimetype: mimetype,
      storedName: file.filename,
    });
    newFile.user = user;
    if (movement) newFile.movements = [movement];
    const savedFile = await this.fileRepository.save(newFile);

    if (file.mimetype === 'image/gif') {
      const gifPath: string = join(
        __dirname,
        '../../../../storage/',
        savedFile.storedName,
      );
      const outPutPath = join(
        __dirname,
        '../../../../storage/',
        `${savedFile.storedName.split('.')[0]}.mp4`,
      );
      await this.ffmpegService.convertGifToMp4(gifPath, outPutPath);
      const mp4 = await this.fileRepository.findOne({
        where: { id: savedFile.id },
      });
      mp4.storedName = `${savedFile.storedName.split('.')[0]}.mp4`;
      mp4.mimetype = 'video/mp4';
      const videoFileSaved = await this.fileRepository.save(mp4);
      const filePath = join(
        __dirname,
        '../../../../storage/',
        savedFile.storedName,
      );
      unlink(filePath, () => {});

      const videoPath: string = join(
        __dirname,
        `../../../../storage/${savedFile.storedName.split('.')[0]}.mp4`,
      );
      const outputDir: string = join(__dirname, '../../../../storage/');
      const timestamp: number = 1;
      const outputName: string = savedFile.storedName.split('.')[0];

      const thumbnail = await this.ffmpegService.generatePoster(
        videoPath,
        timestamp,
        outputDir,
        outputName,
      );

      const mimeType = mime.lookup(thumbnail) || 'application/octet-stream'; // Get MIME type based on file extension

      const thumbnailFileCreate = this.fileRepository.create({
        fileName: `${outputName}.jpeg`, //thumbnail.split('/').at(-1),
        mimetype: mimeType,
        storedName: `${outputName}.jpeg`, // thumbnail.split('/').at(-1),
      });
      thumbnailFileCreate.user = user;

      const thumbnailFileSaved =
        await this.fileRepository.save(thumbnailFileCreate);
      delete thumbnailFileSaved.user;
      delete videoFileSaved.user;
      return { data: [thumbnailFileSaved, videoFileSaved] };
    } else return { data: savedFile };
  }

  async uploadOneVideo(
    file: MulterFile,
    req: Request,
    user: User,
    uploadFileDto: UploadFileDto,
  ): Promise<{ data: File | File[] }> {
    try {
      if (!file) throw new BadRequestException();
      const isVideo = this.configService
        .get<string>('VIDEO_ALLOWD_MIMETYPES')
        .split(',')
        .includes(file.mimetype);

      if (!isVideo) throw new BadRequestException('فرمت فایل صحیح نمی باشد');
      const fileSizeVideo: string =
        this.configService.get<string>('FILE_SIZE_VIDEO');

      if (file.originalname.length > parseFloat(fileSizeVideo))
        throw new BadRequestException(
          `${parseFloat(fileSizeVideo) / 1048576}MB حداکثر حجم قابل پذیریش برای این فایل برابر است با`,
        );

      if (file.size > parseFloat(fileSizeVideo))
        throw new BadRequestException('نام فایل طولانی می باشد');

      // if (!this.utilityService.onlyLettersAndNumbers(file.originalname))
      //   throw new BadRequestException('نام فایل حاوی کاراکترهای غیر مجاز است');

      const filename = `${Date.now()}-${file.originalname}`;

      const mimetype = file.mimetype;

      const videoFileCreate = this.fileRepository.create({
        fileName: filename,
        mimetype: mimetype,
        storedName: file.filename,
      });
      videoFileCreate.user = user;

      const videoFileSaved = await this.fileRepository.save(videoFileCreate);
      delete videoFileSaved.user;
      if (uploadFileDto?.screenSeconds) {
        if (!existsSync(join(__dirname, '..', '..', '..', '..', 'uploads'))) {
          mkdirSync(join(__dirname, '..', '..', '..', '..', 'uploads'));
        }

        const videoPath: string = join(
          __dirname,
          '../../../../storage/',
          videoFileSaved.storedName,
        );
        const outputDir = join(__dirname, '../../../../storage/');
        const timestamp: number = uploadFileDto?.screenSeconds;
        const outputName: string = videoFileSaved.storedName.split('.')[0];

        const thumbnail = await this.ffmpegService.generatePoster(
          videoPath,
          timestamp,
          outputDir,
          outputName,
        );

        const mimeType = mime.lookup(thumbnail) || 'application/octet-stream'; // Get MIME type based on file extension

        const thumbnailFileCreate = this.fileRepository.create({
          fileName: `${outputName}.jpeg`, //thumbnail.split('/').at(-1),
          mimetype: mimeType,
          storedName: `${outputName}.jpeg`, // thumbnail.split('/').at(-1),
        });
        thumbnailFileCreate.user = user;

        const thumbnailFileSaved =
          await this.fileRepository.save(thumbnailFileCreate);
        delete thumbnailFileSaved.user;
        delete videoFileSaved.user;
        return {
          data: [thumbnailFileSaved, videoFileSaved],
        };
      } else return { data: videoFileSaved };
    } catch (error) {
      console.log(error);
      this.logService.logData(
        'update-movement',
        JSON.stringify({
          uploadFileDto: uploadFileDto,
          file: file,
          user: user,
        }),
        error?.message ? error.message : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async uploadOneGif(file: MulterFile, user: User): Promise<File> {
    const fileSizeVideo: string =
      this.configService.get<string>('FILE_SIZE_VIDEO');

    if (file.originalname.length > parseFloat(fileSizeVideo))
      throw new BadRequestException(
        `${parseFloat(fileSizeVideo) / 1048576}MB حداکثر حجم قابل پذیریش برای این فایل برابر است با`,
      );

    if (file.size > parseFloat(fileSizeVideo))
      throw new BadRequestException('نام فایل طولانی می باشد');

    const filename = `${Date.now()}-${file.originalname}`;

    const mimetype = file.mimetype;

    const gifCreate = this.fileRepository.create({
      fileName: filename,
      mimetype: mimetype,
      storedName: file.filename,
    });
    gifCreate.user = user;

    const gifSaved = await this.fileRepository.save(gifCreate);
    delete gifSaved.user;
    return gifSaved;
  }

  async getFile(fileName: string): Promise<ReadStream> {
    const filePath = join(__dirname, '../../../../storage/', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`فایلی با این شناسه یافت نشد`);
    }

    return createReadStream(filePath);
  }

  async findById(ids: string[]): Promise<File[]> {
    return await this.fileRepository.find({
      where: { id: In([...ids]) },
    });
  }

  async getFileName(id: string): Promise<File> {
    const foundFile: File = await this.fileRepository.findOneBy({
      id,
    });
    if (!foundFile) throw new NotFoundException(`فایلی با این شناسه یافت نشد`);
    return foundFile;
  }

  async findAll(): Promise<File[]> {
    return await this.fileRepository.find();
  }

  async delete(id: string, user: User) {
    const file = await this.fileRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
        movements: true,
      },
    });

    if (!file) throw new NotFoundException();

    if (file.user.id !== user.id) {
      throw new UnauthorizedException('شما توانایی حذف این فایل را ندارید!');
    }

    // if (file.movements.length > 0) {
    //   throw new BadRequestException('فایل دارای حرکت میباشد!');
    // }

    await this.fileRepository.delete(id);

    const filePath = join(__dirname, '../../../../storage/', file.storedName);
    unlink(filePath, () => {});

    return { data: 'فایل با موفقیت حذف شد' };
  }
}
