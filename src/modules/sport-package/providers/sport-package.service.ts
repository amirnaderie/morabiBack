import {
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

@Injectable()
export class SportPackageService {
  constructor(
    @InjectRepository(SportPackage)
    private readonly sportPackageRepository: Repository<SportPackage>,
    private readonly logService: LogService,
    private readonly utilityService: UtilityService,
  ) {}

  create(createSportPackageDto: CreateSportPackageDto) {
    return 'This action adds a new sportPackage';
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

  findOne(id: number) {
    return `This action returns a #${id} sportPackage`;
  }

  update(id: number, updateSportPackageDto: UpdateSportPackageDto) {
    return `This action updates a #${id} sportPackage`;
  }

  async remove(id: number, userId: string) {
    const packages = await this.sportPackageRepository.find({
      where: {
        id: id,
        mentor: {
          user: {
            id: userId,
          },
        },
      },
    });
    if (packages.length > 0) {
      try {
        await this.sportPackageRepository.remove(packages);
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
