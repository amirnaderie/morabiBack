import { Athlete } from './entities/athlete.entity';
import { LogService } from '../log/providers/log.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import {
  InternalServerErrorException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AthleteService {
  constructor(
    // AthleteSportPackage
    @InjectRepository(Athlete)
    readonly athleteRepository: Repository<Athlete>,

    readonly logService: LogService,
  ) {}

  async create(createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    try {
      const { categoryId, userId } = createAthleteDto;
      // console.log(categoryId, userId, 'categoryId, userId');
      const athlete = this.athleteRepository.create({
        userId,
        categoryId,
      });

      return await this.athleteRepository.save(athlete);
    } catch (error) {
      this.logService.logData(
        'create-athlete',
        JSON.stringify({ createAthleteDto }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async findAll(): Promise<Athlete[]> {
    try {
      return await this.athleteRepository.find();
    } catch (error) {
      this.logService.logData(
        'findAll-athlete',
        JSON.stringify({ findAll: 'findAll' }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} athlete`;
  }

  async findOneByUserIdAndCategoryId(userId: string, categoryId: number) {
    try {
      return await this.athleteRepository.findOne({
        where: {
          userId: userId,
          categoryId: categoryId,
        },
      });
    } catch (error) {
      this.logService.logData(
        'findOneByUserIdAndCategoryId-athlete',
        JSON.stringify({ userId: userId, categoryId: categoryId }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  update(id: number, updateAthleteDto: UpdateAthleteDto) {
    return `This action updates a #${id} ${updateAthleteDto} athlete`;
  }

  remove(id: number) {
    return `This action removes a #${id} athlete`;
  }

  async findById(ids: string[]): Promise<Athlete[]> {
    try {
      return await this.athleteRepository.find({
        where: { id: In([...ids]) },
      });
    } catch (error) {
      this.logService.logData(
        'findById-athlete',
        JSON.stringify({}),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
