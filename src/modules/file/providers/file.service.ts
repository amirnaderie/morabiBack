import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
  writeFileSync,
} from 'fs';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities/user.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly utilityService: UtilityService,
    private readonly configService: ConfigService,
  ) {}

  async handleFileUpload(
    file: MulterFile,
    req: Request,
    user: User,
    movement?: Movement,
  ): Promise<File> {
    if (!file) {
      const errorMessage = req['fileValidationError'] || 'File upload failed';
      throw new BadRequestException(errorMessage);
    }

    if (
      !this.configService
        .get<string>('IMAGE_ALLOWD_MIMETYPES')
        .split(',')
        .includes(file.mimetype) &&
      !this.configService
        .get<string>('VIDEO_ALLOWD_MIMETYPES')
        .split(',')
        .includes(file.mimetype)
    ) {
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

    const filePath = join(__dirname, '..', '..', 'uploads', filename);

    if (!existsSync(join(__dirname, '..', '..', 'uploads'))) {
      mkdirSync(join(__dirname, '..', '..', 'uploads'));
    }

    writeFileSync(filePath, file.buffer); // Save the file manually

    const newFile = this.fileRepository.create({
      fileName: filename,
      mimetype: mimetype,
    });
    newFile.user = user;
    if (movement) newFile.movement = movement;
    const savedFile = await this.fileRepository.save(newFile);
    return savedFile;
  }

  async getFile(fileName: string): Promise<ReadStream> {
    const filePath = join(__dirname, '..', '..', 'uploads', fileName);

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

  async getFileName(id: string): Promise<string> {
    const foundFile: File = await this.fileRepository.findOneBy({
      id,
    });

    if (!foundFile) throw new NotFoundException(`فایلی با این شناسه یافت نشد`);
    return foundFile.fileName;
  }

  async findAll(): Promise<File[]> {
    return await this.fileRepository.find();
  }
}
