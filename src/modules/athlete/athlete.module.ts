import { Athlete } from './entities/athlete.entity';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthleteService } from './providers/athlete.service';
import { AthleteController } from './athlete.controller';
import { PlanModule } from '../plan/plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Athlete]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
    PlanModule,
  ],
  controllers: [AthleteController],
  providers: [AthleteService],
  exports: [AthleteService],
})
export class AthleteModule {}
