import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './providers/payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { AuthModule } from '../auth/auth.module';
import { LogModule } from '../log/log.module';
import { AthleteSportPackageModule } from '../athlete-sport-package/athlete-sport-package.module';
import { SportPackageModule } from '../sport-package/sport-package.module';
import { AthleteModule } from '../athlete/athlete.module';
// AthleteSportPackageModule
@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
    forwardRef(() => AthleteSportPackageModule),
    forwardRef(() => SportPackageModule),
    forwardRef(() => AthleteModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
