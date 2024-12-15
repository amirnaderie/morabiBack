import { Module } from '@nestjs/common';
import { MentorPackageService } from './mentor-package.service';
import { MentorPackageController } from './mentor-package.controller';

@Module({
  controllers: [MentorPackageController],
  providers: [MentorPackageService],
})
export class MentorPackageModule {}
