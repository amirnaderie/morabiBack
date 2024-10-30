import { Module } from '@nestjs/common';

import { FileController } from './file.controller';
import { FileService } from './providers/file.service';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityModule } from 'src/utility/utility.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([File]),UtilityModule, ConfigModule,AuthModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
