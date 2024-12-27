import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSportPackageDto } from '../dto/create-sport-package.dto';
import { UpdateSportPackageDto } from '../dto/update-sport-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SportPackage } from '../entities/sport-package.entity';
import { Repository } from 'typeorm';
import { LogService } from 'src/modules/log/providers/log.service';
import { UtilityService } from 'src/utility/providers/utility.service';
import { MentorService } from 'src/modules/mentor/providers/mentor.service';

@Injectable()
export class SportPackageService {
  constructor(
    @InjectRepository(SportPackage)
    private readonly sportPackageRepository: Repository<SportPackage>,
    private readonly logService: LogService,
    private readonly utilityService: UtilityService,
    private readonly mentorService: MentorService,
  ) {}

  async create(createSportPackageDto: CreateSportPackageDto, userId: string) {
    const { cost, duration, durationType, name, categoryId } =
      createSportPackageDto;

    if (!this.utilityService.onlyLettersAndNumbers(name))
      throw new BadRequestException('مقادیر ورودی معتبر نیست');

    try {
      const mentor = await this.mentorService.findByIdAndCategory(
        userId,
        categoryId,
      );

      const createdPackage = this.sportPackageRepository.create({
        cost,
        duration,
        durationType,
        name,
        mentorId: mentor.id,
        categoryId: categoryId,
      });
      return await this.sportPackageRepository.save(createdPackage);
    } catch (error) {
      this.logService.logData(
        'create-SportPackage',
        JSON.stringify({ createSportPackageDto, userId }),
        error?.stack ? error.stack : 'error not have message!!',
      );

      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async findAll(userId: string) {
    try {
      const packages = await this.sportPackageRepository.find({
        select: {
          id: true,
          name: true,
          cost: true,
          isAddedToSite: true,
        },
        where: [
          {
            mentor: {
              user: {
                id: userId,
              },
            },
          },
        ],
        order: { createdAt: 'DESC' },
      });

      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: packages,
      };
    } catch (error) {
      this.logService.logData(
        'findAll-packages',
        'no input',
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async findOne(id: number, userId: string) {
    const selectedPackage = await this.sportPackageRepository.findOne({
      where: {
        id: id,
      },
    });
    // delete selectedPackage.mentorId;
    return selectedPackage;
  }

  async update(
    id: number,
    userId: string,
    updateSportPackageDto: UpdateSportPackageDto,
  ) {
    try {
      const { cost, duration, durationType, name } = updateSportPackageDto;

      if (!this.utilityService.onlyLettersAndNumbers(name))
        throw new BadRequestException('مقادیر ورودی معتبر نیست');

      const selectedPackage = await this.sportPackageRepository.find({
        where: {
          id: id,
          mentor: {
            user: {
              id: userId,
            },
          },
        },
      });
      if (selectedPackage.length > 0) {
        await this.sportPackageRepository.update(id, {
          cost,
          duration,
          durationType,
          name,
        });

        return {
          message: `عملیات با موفقیت انجام پذیرفت`,
          // data: updatedPackage,
        };
      }
    } catch (error) {
      this.logService.logData(
        'update-package',
        JSON.stringify({ id: id, updateSportPackageDto }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async updateOneCol(id: number, addedToSite: boolean, userId: string) {
    const selectedPackage = await this.sportPackageRepository.find({
      where: {
        id: id,
        mentor: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (selectedPackage.length > 0) {
      try {
        await this.sportPackageRepository.update(id, {
          isAddedToSite: addedToSite,
        });
        return {
          message: `عملیات با موفقیت انجام پذیرفت`,
        };
      } catch (error) {
        this.logService.logData(
          'update-package',
          JSON.stringify({ id: id, addedToSite }),
          error?.stack ? error.stack : 'error not have message!!',
        );
        throw new InternalServerErrorException(
          'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
        );
      }
    }
  }

  async remove(id: number, userId: string) {
    const selectedPackage = await this.sportPackageRepository.find({
      where: {
        id: id,
        mentor: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (selectedPackage.length > 0) {
      try {
        await this.sportPackageRepository.remove(selectedPackage);
        return {
          message: `عملیات با موفقیت انجام پذیرفت`,
        };
      } catch (error) {
        this.logService.logData(
          'remove-package',
          JSON.stringify({ id: id }),
          error?.stack ? error.stack : 'error not have message!!',
        );
        throw new InternalServerErrorException(
          'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
        );
      }
    }
    this.logService.logData(
      'remove-package',
      JSON.stringify({ id: id }),
      'package not found!',
    );
    throw new NotFoundException('پکیجی یافت نشد');
  }
}
