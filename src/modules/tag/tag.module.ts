import { forwardRef, Module } from '@nestjs/common';
import { TagService } from './providers/tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), forwardRef(() => AuthModule)],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
