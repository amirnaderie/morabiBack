import { Athlete } from './entities/athlete.entity';
import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthleteService } from './athlete.service';
import { AthleteController } from './athlete.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Athlete]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
  ],
  controllers: [AthleteController],
  providers: [AthleteService],
  exports: [AthleteService],
})
export class AthleteModule {}
