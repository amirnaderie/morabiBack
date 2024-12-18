import { Module } from '@nestjs/common';
import { SportPackageService } from './sport-package.service';
import { SportPackageController } from './sport-package.controller';

@Module({
  controllers: [SportPackageController],
  providers: [SportPackageService],
})
export class SportPackageModule {}
