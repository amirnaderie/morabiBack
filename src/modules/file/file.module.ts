import { forwardRef, Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileService } from './providers/file.service';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityModule } from 'src/utility/utility.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { FFmpegService } from './providers/ffmpeg.service';
import { LogModule } from '../log/log.module';
import { s3Service } from './providers/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    UtilityModule,
    ConfigModule,
    forwardRef(() => AuthModule),
    LogModule,
  ],
  controllers: [FileController],
  providers: [FileService, FFmpegService, s3Service],
  exports: [FileService],
})
export class FileModule {}
