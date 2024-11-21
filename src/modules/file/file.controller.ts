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
import { join } from 'path';
import { File } from './entities/file.entity';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { existsSync, mkdirSync } from 'fs';
import { UploadFileDto } from './dto/upload-file.dto';

// import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';
import { VideoValidationPipe } from 'src/pipes/video-validation.pipe';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation.pipe';

@Controller('files')
@UseGuards(AuthGuard)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new ImageValidationPipe([], 1, true))
    file: Express.Multer.File,
    @Req()
    req: Request,
    @GetUser() user: User,
  ): Promise<{ data: File | File[] }> {
    // const storageDir = join(__dirname, 'storage');
    // if (!existsSync(storageDir)) {
    //   mkdirSync(storageDir, { recursive: true });
    // }
    return await this.fileService.handleFileUpload(file, req, user);
  }
  // video\/(mp4|webm|ogg)
  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOneVideo(
    @UploadedFile(new VideoValidationPipe([], 1, true))
    file: Express.Multer.File,
    @Req() req: Request,
    @GetUser() user: User,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<{ data: File | File[] } | any> {
    // const storageDir = join(__dirname, 'storage');
    // if (!existsSync(storageDir)) {
    //   mkdirSync(storageDir, { recursive: true });
    // }

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
      // console.log(fileStream, 'fileStream');

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

    return await this.fileService.delete(fileId, user);
  }

  @Get('')
  async findAll(): Promise<File[]> {
    const files = await this.fileService.findAll();
    return files;
  }
}
