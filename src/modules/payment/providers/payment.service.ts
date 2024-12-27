import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from 'src/modules/users/entities/user.entity';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { LogService } from 'src/modules/log/providers/log.service';
import { AthleteService } from 'src/modules/athlete/athlete.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SportPackageService } from 'src/modules/sport-package/providers/sport-package.service';
import { AthleteSportPackageService } from 'src/modules/athlete-sport-package/athlete-sport-package.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentService: Repository<Payment>,
    private readonly logService: LogService,
    private readonly athleteService: AthleteService,
    private readonly sportPackageService: SportPackageService,
    private readonly athleteSportPackageService: AthleteSportPackageService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: User) {
    try {
      const { packageId, userId } = createPaymentDto;
      // create payment
      const paymentInstance = this.paymentService.create({
        userId: userId,
        sportPackageId: packageId,
      });
      const payment = await this.paymentService.save(paymentInstance);

      // get sport package
      const sportPackage = await this.sportPackageService.findOne(
        packageId,
        userId,
      );
      console.log(sportPackage, 'sportPackage');

      // get athlete
      let athlete = await this.athleteService.findOneByUserIdAndCategoryId(
        userId,
        packageId,
      );

      if (!athlete) {
        athlete = await this.athleteService.create({
          categoryId: sportPackage.categoryId,
          userId: userId,
        });
      }
      // save
      console.log(sportPackage, 'sportPackage');
      this.athleteSportPackageService.create({
        athleteId: athlete.id,
        mentorId: sportPackage.mentorId,
        sportPackageId: sportPackage.id,
      });

      return payment;
    } catch (error) {
      this.logService.logData(
        'create-payment',
        JSON.stringify({ createPaymentDto: createPaymentDto, user: user }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message.includes('Violation of UNIQUE KEY constraint'))
        throw new ConflictException('اطلاعات تکراری است');
      else
        throw new InternalServerErrorException(
          'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
        );
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
