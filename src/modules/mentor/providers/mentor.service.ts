import { Mentor } from '../entities/mentor.entity';
import { Repository } from 'typeorm';
import { LogService } from '../../log/providers/log.service';
import { CreateMentorDto } from '../dto/create-mentor.dto';
import { UpdateMentorDto } from '../dto/update-mentor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignAthletesDto } from '../dto/assign-athlete.dto';
import { User } from '../../users/entities/user.entity';
import { AthleteService } from '../../athlete/providers/athlete.service';
import { AthleteSportPackageService } from 'src/modules/athlete-sport-package/athlete-sport-package.service';
import { AthleteSportPackage } from 'src/modules/athlete-sport-package/entities/athlete-sport-package.entity';

@Injectable()
export class MentorService {
  constructor(
    @InjectRepository(Mentor)
    private readonly mentorRepository: Repository<Mentor>,
    readonly logService: LogService,
    readonly athleteService: AthleteService,
    readonly athleteSportPackageService: AthleteSportPackageService,
  ) {}

  async create(createMentorDto: CreateMentorDto): Promise<Mentor> {
    try {
      const { categoryId, userId } = createMentorDto;
      const mentor = this.mentorRepository.create({
        userId: userId,
        categoryId: categoryId,
      });
      return await this.mentorRepository.save(mentor);
    } catch (error) {
      console.log(error);
      this.logService.logData(
        'create-mentor',
        JSON.stringify({ createMentorDto }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
  }

  async assignAthletes(
    assignAthletesDto: AssignAthletesDto,
    user: User,
  ): Promise<Mentor> {
    try {
      const { athleteIds } = assignAthletesDto;
      const { id } = user;

      const athletes = await this.athleteService.findById(athleteIds);
      const mentor = await this.mentorRepository.findOne({
        where: {
          userId: id,
        },
      });

      if (!mentor) throw new NotFoundException();

      mentor.athletes = athletes;

      return mentor;
    } catch (error) {
      // console.log(error);
      this.logService.logData(
        'assign-athletes',
        JSON.stringify({ assignAthletesDto, user }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
  }
  //  (user , category) -> mentor -> athletePacageMentor -> athlete
  async getAthletes(user: User, categoryId: number) {
    try {
      const userId = user.id;
      const mentor = await this.mentorRepository.findOne({
        where: {
          userId: userId,
          categoryId: categoryId,
        },
      });

      const athletes: AthleteSportPackage[] =
        await this.athleteSportPackageService.findAllByMentorId(mentor.id);
      const result = athletes.map((athlete: any) => {
        return {
          id: athlete.id,
          name: athlete.name,
          family: athlete.family,
          status: !!athlete.packages.find((pkg) => {
            const date = new Date(pkg.buyPackageAt);
            date.setDate(date.getDate() + pkg.duration);
            return date > new Date();
          }),
          ...athlete.packages.reduce(
            (acc, { buyPackageAt, duration }) => {
              const createdDate = new Date(buyPackageAt);

              const date = new Date(buyPackageAt);
              date.setDate(date.getDate() + duration);
              const expireDate = date;

              if (!acc.startedAt || createdDate < acc.startedAt.buyPackageAt) {
                acc.startedAt = createdDate;
              }
              if (!acc.expireAt || expireDate > acc.expireAt.buyPackageAt) {
                acc.expireAt = expireDate;
              }

              return acc;
            },
            { startedAt: null, expireAt: null },
          ),
        };
      });
      return result;
    } catch (error) {
      this.logService.logData(
        'getAthletes-mentor',
        'no input',
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} userType`;
  }

  async update(id: string, updateMentorDto: UpdateMentorDto): Promise<Mentor> {
    try {
      const { categoryId, userId } = updateMentorDto;
      const usertype = await this.mentorRepository.findOneBy({ id });
      usertype.categoryId = categoryId;
      usertype.userId = userId;
      return await this.mentorRepository.save(usertype);
    } catch (error) {
      this.logService.logData(
        'update-mentor',
        JSON.stringify({ updateMentorDto, id }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم. ممنون از شکیبایی شما',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userType`;
  }

  async findByIdAndCategory(userId: string, categoryId: number) {
    try {
      const mentor = await this.mentorRepository.findOne({
        select: {
          id: true,
        },
        where: [
          {
            userId: userId,
            categoryId: categoryId,
          },
        ],
      });
      return mentor;
    } catch (error) {
      this.logService.logData(
        'findByIdAndCategory-mentor',
        JSON.stringify({ userId, categoryId }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new error();
    }
  }
}
