import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as fs from 'fs';
import { join } from 'path';
import { File } from '../entities/file.entity';
import { v4 as uuidv4 } from 'uuid';
import { MulterFile } from '../fileOptions';
import { In, Repository } from 'typeorm';
import { UtilityService } from 'src/utility/providers/utility.service';
import { InjectRepository } from '@nestjs/typeorm';

import { unlink, existsSync, ReadStream, createReadStream } from 'fs';

import * as mime from 'mime-types';
import { User } from 'src/modules/users/entities/user.entity';
import { s3Service } from './s3.service';
import { LogService } from 'src/modules/log/providers/log.service';
import { ConfigService } from '@nestjs/config';
import { FFmpegService } from './ffmpeg.service';
import { UploadFileDto } from '../dto/upload-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly utilityService: UtilityService,
    private readonly configService: ConfigService,
    private readonly ffmpegService: FFmpegService,
    private readonly logService: LogService,
    private readonly s3Service: s3Service,
  ) {}

  async handleFileUpload(
    file: MulterFile,
    req: Request,
    user: User,
  ): Promise<{ data: File | File[] } | any> {
    try {
      const filename = `${Date.now()}-${file.originalname}`;

      const inputFilePath = join(__dirname, 'storage', filename);

      if (!fs.existsSync(join(__dirname, 'storage'))) {
        fs.mkdirSync(join(__dirname, 'storage'), { recursive: true });
      }

      fs.writeFileSync(inputFilePath, file.buffer);
      const uuidFileName = uuidv4();

      if (file.mimetype === 'image/gif') {
        const gifPath: string = join(__dirname, 'storage', filename);
        const outPutPath = join(__dirname, 'storage', `${uuidFileName}.mp4`);
        await this.ffmpegService.convertGifToMp4(gifPath, outPutPath);

        unlink(inputFilePath, () => {});

        const mp4Create = this.fileRepository.create({
          orginalName: filename,
          mimetype: 'video/mp4',
          storedName: `${uuidFileName}.mp4`,
          realmId: (req as any).subdomainId || 1,
          user,
        });

        const videoFileSaved = await this.fileRepository.save(mp4Create);

        const videoPath: string = join(
          __dirname,
          'storage',
          `${uuidFileName}.mp4`,
        );
        const outputDir: string = join(__dirname, 'storage');
        const timestamp: number = 1;
        const outputName: string = videoFileSaved.storedName.split('.')[0];

        const thumbnail = await this.ffmpegService.generatePoster(
          videoPath,
          timestamp,
          outputDir,
          outputName,
        );

        const mimeType = mime.lookup(thumbnail) || 'application/octet-stream';

        const thumbnailFileCreate = this.fileRepository.create({
          orginalName: `${outputName}.jpeg`,
          mimetype: mimeType,
          storedName: `${outputName}.jpeg`,
          realmId: (req as any).subdomainId || 1,
          user,
        });

        const thumbnailFileSaved =
          await this.fileRepository.save(thumbnailFileCreate);
        delete thumbnailFileSaved.user;
        delete videoFileSaved.user;

        const getVideoFileSaved: ReadStream = await this.getFile(
          videoFileSaved.storedName,
        );
        await this.s3Service.storeObject(
          getVideoFileSaved,
          `${videoFileSaved.realmId}/${videoFileSaved.storedName}`,
        );

        const getThumbnailFileSaved: ReadStream = await this.getFile(
          thumbnailFileSaved.storedName,
        );
        await this.s3Service.storeObject(
          getThumbnailFileSaved,
          `${thumbnailFileSaved.realmId}/${thumbnailFileSaved.storedName}`,
        );
        const thumbnailPath: string = join(
          __dirname,
          'storage',
          thumbnailFileSaved.storedName,
        );
        unlink(thumbnailPath, () => {});
        unlink(videoPath, () => {});
        return { data: [thumbnailFileSaved, videoFileSaved] };
      } else {
        // const getSavedFile: ReadStream = await this.getFile(
        //   savedFile.storedName,
        // );
        // await this.s3Service.storeObject(
        //   getSavedFile,
        //   `${savedFile.realmId}/${savedFile.storedName}`,
        // );
        // const savedFilePath: string = join(
        //   __dirname,
        //   '/storage/',
        //   savedFile.storedName,
        // );
        // unlink(savedFilePath, () => {});
        // return { data: savedFile };
      }
    } catch (error) {
      this.logService.logData(
        'upload-file',
        JSON.stringify({
          file,
          req,
          user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async uploadOneVideo(
    file: Express.Multer.File,
    req: Request,
    user: User,
    uploadFileDto: UploadFileDto,
  ): Promise<{ data: File | File[] }> {
    try {
      if (!file) throw new BadRequestException();
      const filename = `${Date.now()}-${file.originalname}`;

      const inputFilePath = join(__dirname, 'storage', filename);

      if (!fs.existsSync(join(__dirname, 'storage'))) {
        fs.mkdirSync(join(__dirname, 'storage'), { recursive: true });
      }

      fs.writeFileSync(inputFilePath, file.buffer);
      const uuidFileName = uuidv4();

      const filePath: string = join(__dirname, 'storage', filename);
      const outPutPath = join(__dirname, 'storage', `${uuidFileName}.mp4`);
      console.log(111111);
      await this.ffmpegService.convertGifToMp4(filePath, outPutPath);
      console.log(222222);
      unlink(inputFilePath, () => {});

      const newVideo = this.fileRepository.create({
        mimetype: file.mimetype,
        orginalName: file.originalname,
        realmId: (req as any).subdomainId || 1,
        storedName: `${uuidFileName}.mp4`,
        user,
      });

      const videoFileSaved = await this.fileRepository.save(newVideo);
      delete videoFileSaved.user;

      if (uploadFileDto?.screenSeconds) {
        const videoPath: string = join(
          __dirname,
          'storage',
          videoFileSaved.storedName,
        );
        const outputDir = join(__dirname, 'storage');
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
          orginalName: `${outputName}.jpeg`, //thumbnail.split('/').at(-1),
          mimetype: mimeType,
          storedName: `${outputName}.jpeg`, // thumbnail.split('/').at(-1),
          realmId: (req as any).subdomainId || 1,
          user,
        });

        const thumbnailFileSaved =
          await this.fileRepository.save(thumbnailFileCreate);
        delete thumbnailFileSaved.user;
        delete videoFileSaved.user;

        const getVideoFileSaved: ReadStream = await this.getFile(
          videoFileSaved.storedName,
        );
        const getThumbnailFileSaved: ReadStream = await this.getFile(
          thumbnailFileSaved.storedName,
        );
        await this.s3Service.storeObject(
          getVideoFileSaved,
          `${videoFileSaved.realmId}/${videoFileSaved.storedName}`,
        );
        await this.s3Service.storeObject(
          getThumbnailFileSaved,
          `${thumbnailFileSaved.realmId}/${thumbnailFileSaved.storedName}`,
        );
        const thumbnailPath: string = join(
          __dirname,
          'storage',
          thumbnailFileSaved.storedName,
        );
        unlink(thumbnailPath, () => {});
        unlink(videoPath, () => {});
        return {
          data: [thumbnailFileSaved, videoFileSaved],
        };
      } else {
        const file: ReadStream = await this.getFile(videoFileSaved.storedName);
        await this.s3Service.storeObject(
          file,
          `${videoFileSaved.realmId}/${videoFileSaved.storedName}`,
        );
        const videoPath: string = join(
          __dirname,
          'storage',
          videoFileSaved.storedName,
        );
        unlink(videoPath, () => {});
        return { data: videoFileSaved };
      }
    } catch (error) {
      console.error(error);
      this.logService.logData(
        'uploadOneVideo-file',
        JSON.stringify({
          uploadFileDto: uploadFileDto,
          file: file,
          user: user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async getFile(fileName: string): Promise<ReadStream> {
    try {
      const filePath = join(__dirname, 'storage', fileName);
      if (!existsSync(filePath)) {
        throw new NotFoundException(`فایلی با این شناسه یافت نشد`);
      }

      return createReadStream(filePath);
    } catch (error) {
      this.logService.logData(
        'getFile-file',
        JSON.stringify({}),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async findById(ids: string[]): Promise<File[]> {
    try {
      return await this.fileRepository.find({
        where: { id: In([...ids]) },
      });
    } catch (error) {
      this.logService.logData(
        'findById-file',
        JSON.stringify({}),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async getFileName(id: string): Promise<File> {
    try {
      const foundFile: File = await this.fileRepository.findOneBy({
        id,
      });
      if (!foundFile)
        throw new NotFoundException(`فایلی با این شناسه یافت نشد`);
      return foundFile;
    } catch (error) {
      this.logService.logData(
        'getFileName-file',
        JSON.stringify({}),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async findAll(): Promise<File[]> {
    try {
      return await this.fileRepository.find();
    } catch (error) {
      this.logService.logData(
        'findAll-file',
        JSON.stringify({}),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }
    }
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

    try {
      const filePath = join(__dirname, 'storage', file.storedName);
      unlink(filePath, () => {});
      return { data: 'فایل با موفقیت حذف شد' };
    } catch (error) {
      this.logService.logData(
        'delete-file',
        JSON.stringify({
          id: id,
          user: user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
