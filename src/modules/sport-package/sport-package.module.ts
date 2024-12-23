import { forwardRef, Module } from '@nestjs/common';
import { SportPackageController } from './sport-package.controller';
import { SportPackageService } from './providers/sport-package.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportPackage } from './entities/sport-package.entity';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';
import { UtilityModule } from 'src/utility/utility.module';
import { Mentor } from '../mentor/entities/mentor.entity';
import { MentorModule } from '../mentor/mentor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SportPackage]),
    AuthModule,
    LogModule,
    UtilityModule,
    MentorModule,
  ],
  controllers: [SportPackageController],
  providers: [SportPackageService],
})
export class SportPackageModule {}
