import { forwardRef, Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './providers/plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { FileModule } from '../file/file.module';
import { TagModule } from '../tag/tag.module';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => TagModule),
    forwardRef(() => LogModule),
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
