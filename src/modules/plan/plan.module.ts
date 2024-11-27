import { forwardRef, Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './providers/plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { FileModule } from '../file/file.module';
import { TagModule } from '../tag/tag.module';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { UtilityModule } from 'src/utility/utility.module';
import { MovementModule } from '../movement/movement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => TagModule),
    forwardRef(() => LogModule),
    forwardRef(() => MovementModule),
    UtilityModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
