import { Module } from '@nestjs/common';
import { MovmentService } from './movment.service';
import { MovmentController } from './movment.controller';

@Module({
  controllers: [MovmentController],
  providers: [MovmentService],
})
export class MovmentModule {}
