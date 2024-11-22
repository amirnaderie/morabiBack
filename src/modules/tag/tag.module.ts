import { forwardRef, Module } from '@nestjs/common';
import { TagService } from './providers/tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { AuthModule } from '../auth/auth.module';
import { UtilityModule } from 'src/utility/utility.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    forwardRef(() => AuthModule),
    UtilityModule,
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
