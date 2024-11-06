import {
  Controller,
  Get,
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
import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { File } from './entities/file.entity';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('files')
@UseGuards(AuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(MulterFileInterceptor('file', multerOptions))
  // @HttpCode(200) // Change the status code here
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<File> {
    console.log(file, 'file');
    const storageDir = join(__dirname, 'storage');
    if (!existsSync(storageDir)) {
      mkdirSync(storageDir, { recursive: true }); // Create the directory recursively if needed
    }
    return await this.fileService.handleFileUpload(file, req, user);
  }

  @Get('download/:fileId') async downloadFile(
    @Param('fileId', ParseUUIDPipe)
    fileId: string,
    @Res() res: Response,
  ) {
    try {
      const { fileName, mimetype } = await this.fileService.getFileName(fileId);
      const fileStream = await this.fileService.getFile(fileName);
      // res.set({
      //   'Content-Type': 'application/octet-stream',
      //   'Content-Disposition': `attachment; filename="${fileName}"`,
      // });
      res.setHeader('Content-Type', mimetype);
      // fileStream.pipe(res);
      return res.sendFile(fileStream.path as string);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('')
  async findAll(): Promise<File[]> {
    const files = await this.fileService.findAll();
    console.log(files, 'filesfiles');
    return files;
  }
}
