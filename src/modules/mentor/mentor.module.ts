import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './entities/mentor.entity';
import { MentorController } from './mentor.controller';
import { AthleteModule } from '../athlete/athlete.module';
import { MentorService } from './providers/mentor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentor]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
    forwardRef(() => AthleteModule),
  ],
  controllers: [MentorController],
  providers: [MentorService],
  exports: [MentorService],
})
export class MentorModule {}
