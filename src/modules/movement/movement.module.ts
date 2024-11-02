import { forwardRef, Module } from '@nestjs/common';
import { MovementService } from './movement.service';
import { MovementController } from './movement.controller';
import { FileModule } from '../file/file.module';
import { AuthModule } from '../auth/auth.module';
import { Movement } from './entities/movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => TagModule),
  ],
  controllers: [MovementController],
  providers: [MovementService],
  exports: [MovementService],
})
export class MovementModule {}
