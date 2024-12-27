import { LogService } from '../log/providers/log.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AthleteSportPackage } from './entities/athlete-sport-package.entity';
import { CreateAthleteSportPackageDto } from './dto/create-athlete-sport-package.dto';
import { InternalServerErrorException, Injectable } from '@nestjs/common';

@Injectable()
export class AthleteSportPackageService {
  constructor(
    @InjectRepository(AthleteSportPackage)
    readonly athleteSportPackageRepository: Repository<AthleteSportPackage>,
    readonly logService: LogService,
  ) {}

  async create(
    createAthleteSportPackageDto: CreateAthleteSportPackageDto,
  ): Promise<AthleteSportPackage> {
    try {
      const { athleteId, mentorId, sportPackageId } =
        createAthleteSportPackageDto;

      const p = this.athleteSportPackageRepository.create({
        athleteId,
        mentorId,
        sportPackageId,
      });

      return await this.athleteSportPackageRepository.save(p);
    } catch (error) {
      console.log(error, 'error');
      this.logService.logData(
        'assignSportPackage',
        JSON.stringify({ createAthleteSportPackageDto }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async findAllByMentorId(mentorId: string): Promise<AthleteSportPackage[]> {
    try {
      return await this.athleteSportPackageRepository.find({
        relations: ['athlete', 'athlete.user.profile'],
        where: {
          mentorId,
        },

        select: {
          athlete: {
            id: true,
            user: {
              id: true,
              profile: {
                id: true,
                name: true,
                family: true,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error, 'error');
      this.logService.logData(
        'findAllByMentorId',
        JSON.stringify({ mentorId }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  findAll() {
    return `This action returns all athleteSportPackage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} athleteSportPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} athleteSportPackage`;
  }
}
