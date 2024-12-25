import { forwardRef, Module } from '@nestjs/common';
import { AthleteSportPackageService } from './athlete-sport-package.service';
import { AthleteSportPackageController } from './athlete-sport-package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthleteSportPackage } from './entities/athlete-sport-package.entity';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AthleteSportPackage]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
  ],
  controllers: [AthleteSportPackageController],
  providers: [AthleteSportPackageService],
  exports: [AthleteSportPackageService],
})
export class AthleteSportPackageModule {}
