import { User } from '../../users/entities/user.entity';
import { Athlete } from '../entities/athlete.entity';
import { LogService } from '../../log/providers/log.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAthleteDto } from '../dto/update-athlete.dto';
import { CreateAthleteDto } from '../dto/create-athlete.dto';
import { In, Repository } from 'typeorm';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
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
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
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
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
  }

  async findActiveAthletes(mentorUserId: string, athleteId?: string) {
    let activeAthletes;
    try {
      if (athleteId)
        activeAthletes = await this.athleteRepository.query(
          'exec getAthletesOfMentor @mentorUserId=@0 , @athleteId=@1',
          [mentorUserId, athleteId],
        );
      else
        activeAthletes = await this.athleteRepository.query(
          'exec getAthletesOfMentor @mentorUserId=@0',
          [mentorUserId],
        );
      return activeAthletes;
    } catch (error) {
      this.logService.logData(
        'findActiveAthletes',
        JSON.stringify({ mentorUserId, athleteId }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw error;
    }
  }

  async findOne(athleteId: string, mentorUserId: string) {
    let athleteOfMentor;

    try {
      athleteOfMentor = await this.athleteRepository.findOne({
        relations: ['user'],
        where: {
          id: athleteId,
          athleteSportPackages: {
            mentor: { userId: mentorUserId },
          },
        },
        select: {
          id: true,
          createdAt: true,
          user: {
            id: true,
            name: true,
            family: true,
          },
        },
      });
    } catch (error) {
      this.logService.logData(
        'findOne-athlete',
        JSON.stringify({ findOne: 'findOne' }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
    if (!athleteOfMentor) throw new NotFoundException('اطلاعاتی یافت نشد');

    let activeAthletes;

    try {
      activeAthletes = await this.findActiveAthletes(mentorUserId, athleteId);
    } catch (error) {
      this.logService.logData(
        'findOne-athlete',
        JSON.stringify({ findOne: 'findOne' }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
    if (activeAthletes && activeAthletes.length > 0)
      return {
        startedAt: activeAthletes[0].startedAt,
        expireAt: activeAthletes[0].expireAt,
        id: activeAthletes[0].athleteId,
        name: activeAthletes[0].athleteName,
        family: activeAthletes[0].athleteFamily,
        status: true,
      };
    else {
      return {
        startedAt: athleteOfMentor.createdAt,
        expireAt: null,
        id: athleteOfMentor.user.id,
        name: athleteOfMentor.user.name,
        family: athleteOfMentor.user.family,
        status: false,
      };
    }
  }

  async findOne1(athleteId: string, mentorUser: User) {
    try {
      const activeAthletes = await this.findActiveAthletes(
        mentorUser.id,
        athleteId,
      );

      const athleteOfMentor = await this.athleteRepository.findOne({
        relations: [
          'user',
          'athleteSportPackages',
          'athleteSportPackages.sportPackage',
        ],
        where: {
          id: athleteId,
          athleteSportPackages: {
            mentor: { userId: mentorUser.id },
          },
        },
        select: {
          id: true,
          user: {
            id: true,
            name: true,
            family: true,
          },
          athleteSportPackages: {
            id: true,
            createdAt: true,
            sportPackage: {
              id: true,
              duration: true,
            },
          },
        },
      });

      const status = !!athleteOfMentor.athleteSportPackages.find((pkg) => {
        const date = new Date(pkg.createdAt);
        date.setDate(date.getDate() + pkg.sportPackage.duration);
        return date > new Date();
      });

      const result = athleteOfMentor.athleteSportPackages.reduce(
        (acc, { createdAt, sportPackage: { duration } }) => {
          const createdDate = new Date(createdAt);

          const date = new Date(createdAt);
          date.setDate(date.getDate() + duration);
          const expireDate = date;

          if (!acc.startedAt || createdDate < acc.startedAt.createdAt) {
            acc.startedAt = createdDate;
          }
          if (!acc.expireAt || expireDate > acc.expireAt.createdAt) {
            acc.expireAt = expireDate;
          }

          return acc;
        },
        { startedAt: null, expireAt: null },
      );
      console.log(result);
      console.log(athleteOfMentor.user);
      console.log(status);

      return {
        ...result,
        ...athleteOfMentor.user,
        status,
      };
    } catch (error) {
      this.logService.logData(
        'findOne-athlete',
        JSON.stringify({ findOne: 'findOne' }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
  }

  async findOneByUserIdAndCategoryId(userId: string, categoryId: number) {
    try {
      console.log(userId, categoryId, 'dvd');
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
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
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
