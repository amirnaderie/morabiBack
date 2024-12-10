import { Module } from '@nestjs/common';
import { AthleteMentorService } from './athlete-mentor.service';
import { AthleteMentorController } from './athlete-mentor.controller';

@Module({
  controllers: [AthleteMentorController],
  providers: [AthleteMentorService],
})
export class AthleteMentorModule {}
