import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly allowedTypes: string[], // E.g., ['image/png', 'image/jpeg']
    private readonly maxSizeMB: number, // Max file size in MB
    private readonly useDefaultEnv: boolean, // Max file size in MB
  ) {}

  transform(file: Express.Multer.File) {
    const configService = new ConfigService();
    let fileMimetype = this.allowedTypes; // FILE_SIZE_VIDEO
    let fileSize = this.maxSizeMB; // FILE_SIZE_VIDEO FILE_NAME_LENGTH
    const defaultFileNameSize = configService.get<number>('FILE_NAME_LENGTH');
    if (this.useDefaultEnv) {
      fileMimetype = configService
        .get<string>('VIDEO_ALLOWD_MIMETYPES')
        .split(',');

      if (fileMimetype.includes('video'))
        fileSize = configService.get<number>('FILE_SIZE_VIDEO');
      if (fileMimetype.includes('image'))
        fileSize = configService.get<number>('FILE_SIZE_IMAGE');
    }

    if (!file) {
      throw new BadRequestException('فایل را وارد کنید');
    }

    // Validate file type
    console.log(fileMimetype, 'fileMimetype');
    console.log(file.mimetype, 'file.mimetype');
    console.log(
      fileMimetype.includes(file.mimetype),
      'file.fileMimetype.includes(file.mimetype)',
    );
    if (!fileMimetype.includes(file.mimetype)) {
      throw new BadRequestException(
        ` ${fileMimetype.join(', ')} :فرمت های مجاز `,
      );
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > fileSize) {
      throw new BadRequestException(
        `باشد mb ${fileSize}  حجم فایل باید کمتر از`,
      );
    }

    // Validate file name length
    const fileNameLength = file.originalname.length;
    if (fileNameLength > defaultFileNameSize) {
      throw new BadRequestException(
        `نام فایل طولانی است ${defaultFileNameSize} حرف مورد قبول است`,
      );
    }

    return file; // Return the validated file
  }
}
