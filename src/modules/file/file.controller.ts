import {
  Get,
  Req,
  Res,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFile,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { FileService } from './providers/file.service';
import {
  MulterFile,
  multerOptions,
  oneVideoMulterOptions,
} from './fileOptions';
import { join } from 'path';
import { File } from './entities/file.entity';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { existsSync, mkdirSync } from 'fs';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileInterceptor as MulterFileInterceptor } from '@nestjs/platform-express';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('files')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(MulterFileInterceptor('file', multerOptions))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<File> {
    const storageDir = join(__dirname, 'storage');
    if (!existsSync(storageDir)) {
      mkdirSync(storageDir, { recursive: true });
    }
    return await this.fileService.handleFileUpload(file, req, user);
  }

  @Post('upload-video')
  @UseInterceptors(MulterFileInterceptor('file', oneVideoMulterOptions))
  async uploadOneVideo(
    @UploadedFile() file: MulterFile,
    @Req() req: Request,
    @GetUser() user: User,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<File | File[]> {
    const storageDir = join(__dirname, 'storage');
    if (!existsSync(storageDir)) {
      mkdirSync(storageDir, { recursive: true });
    }
    return await this.fileService.uploadOneVideo(
      file,
      req,
      user,
      uploadFileDto,
    );
  }

  @Get('download/:fileId') async downloadFile(
    @Param('fileId', ParseUUIDPipe)
    fileId: string,
    @Res() res: Response,
  ) {
    try {
      const { mimetype, storedName } =
        await this.fileService.getFileName(fileId);
      const fileStream = await this.fileService.getFile(storedName);
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

  @Delete('/:fileId') async delete(
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @GetUser()
    user: User,
  ) {
    console.log(user, 'ddd user');

    return await this.fileService.delete(fileId, user);
  }

  @Get('')
  async findAll(): Promise<File[]> {
    const files = await this.fileService.findAll();
    return files;
  }
}
