import { forwardRef, Module } from '@nestjs/common';
import { MovementService } from './providers/movement.service';
import { MovementController } from './movement.controller';
import { FileModule } from '../file/file.module';
import { AuthModule } from '../auth/auth.module';
import { Movement } from './entities/movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from '../tag/tag.module';
import { LogModule } from '../log/log.module';
import { UtilityModule } from 'src/utility/utility.module';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => TagModule),
    forwardRef(() => LogModule),
    forwardRef(() => PlanModule),
    UtilityModule,
  ],
  controllers: [MovementController],
  providers: [MovementService],
  exports: [MovementService],
})
export class MovementModule {}
