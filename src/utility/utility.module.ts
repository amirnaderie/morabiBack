import { Module } from '@nestjs/common';
import { UtilityService } from './providers/utility.service';

@Module({
  providers: [UtilityService],
  exports: [UtilityService],
})
export class UtilityModule {}
