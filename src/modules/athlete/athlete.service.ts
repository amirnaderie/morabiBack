import { Athlete } from './entities/athlete.entity';
import { LogService } from '../log/providers/log.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { InternalServerErrorException, Injectable } from '@nestjs/common';

@Injectable()
export class AthleteService {
  constructor(
    @InjectRepository(Athlete)
    readonly athleteRepository: Repository<Athlete>,
    readonly logService: LogService,
  ) {}

  async create(createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    try {
      const { categoryId, userId } = createAthleteDto;

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

  update(id: number, updateAthleteDto: UpdateAthleteDto) {
    return `This action updates a #${id} athlete`;
  }

  remove(id: number) {
    return `This action removes a #${id} athlete`;
  }
}
