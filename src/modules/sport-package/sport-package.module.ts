import { Module } from '@nestjs/common';
import { SportPackageController } from './sport-package.controller';
import { SportPackageService } from './providers/sport-package.service';

@Module({
  controllers: [SportPackageController],
  providers: [SportPackageService],
})
export class SportPackageModule {}
