import {
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './providers/file.service';
import { MulterFile, multerOptions } from './fileOptions';
import { FileInterceptor as MulterFileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post('upload-image')
  @UseInterceptors(MulterFileInterceptor('file', multerOptions))
  // @HttpCode(200) // Change the status code here
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Req() req: Request,
  ): Promise<{ fileId: string }> {
    return await this.fileService.handleFileUpload(file, req);
  }
}
