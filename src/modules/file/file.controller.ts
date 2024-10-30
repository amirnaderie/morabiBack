import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { FileService } from './providers/file.service';
import { MulterFile, multerOptions } from './fileOptions';
import { FileInterceptor as MulterFileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('file')
@UseGuards(AuthGuard)
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

  @Get('download/:fileId') async downloadFile(
    @Param('fileId', ParseUUIDPipe)
    fileId: string,
    @Res() res: Response,
  ) {
    try {
      const fileName = await this.fileService.getFileName(fileId);
      const fileStream = await this.fileService.getFile(fileName);
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
      fileStream.pipe(res);
    } catch (error) {
      throw new Error(error);
    }
  }
}
