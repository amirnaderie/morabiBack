import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MulterFile } from '../fileOptions';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { Repository } from 'typeorm';
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

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly usresRepository: Repository<File>,
    private readonly utilityService: UtilityService,
    private readonly configService: ConfigService,
  ) {}

  async handleFileUpload(file: MulterFile, req): Promise<{ fileId: string }> {
    if (!file) {
      const errorMessage = req['fileValidationError'] || 'File upload failed';
      throw new BadRequestException(errorMessage);
    }

    if (
      !this.configService
        .get<string>('IMAGE_ALLOWD_MIMETYPES')
        .split(',')
        .includes(file.mimetype)
    ) {
      throw new BadRequestException('فرمت فایل صحیح  نمی باشد');
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
      file.size > parseFloat(this.configService.get<string>('FILE_SIZE_IMAGE'))
    ) {
      throw new BadRequestException('نام فایل طولانی می باشد');
    }

    if (!this.utilityService.onlyLettersAndNumbers(file.originalname)) {
      throw new BadRequestException('نام فایل حاوی کاراکترهای غیر مجاز است');
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = join(__dirname, '..', '..', 'uploads', filename);

    if (!existsSync(join(__dirname, '..', '..', 'uploads'))) {
      mkdirSync(join(__dirname, '..', '..', 'uploads'));
    }

    writeFileSync(filePath, file.buffer); // Save the file manually

    const newFile = this.usresRepository.create({ fileName: filename });
    const savedFile = await this.usresRepository.save(newFile);
    return { fileId: savedFile.id };
  }

  async getFile(fileName: string): Promise<ReadStream> {
    const filePath = join(__dirname, '..', '..', 'uploads', fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`فایلی با این شناسه یافت نشد`);
    }
    return createReadStream(filePath);
  }

  async getFileName(fileId: string): Promise<string> {
    const foundFile: File = await this.usresRepository.findOneBy({
      id: fileId,
    });

    if (!foundFile) throw new NotFoundException(`فایلی با این شناسه یافت نشد`);
    return foundFile.fileName;
  }
}
