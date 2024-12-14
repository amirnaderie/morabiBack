import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { MentorAthlete } from './entities/mentor-athlete.entity';
import { MentorAthleteController } from './controllers/mentor-athlete.controller';
import { MentorAthleteService } from './providers/mentor-athlete.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorAthlete]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
  ],
  controllers: [MentorAthleteController],
  providers: [MentorAthleteService],
})
export class MentorAthleteModule {}
