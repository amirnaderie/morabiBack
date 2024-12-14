import { User } from '../../users/entities/user.entity';
import { LogService } from '../../log/providers/log.service';
import { Repository } from 'typeorm';
import { MentorAthlete } from '../entities/mentor-athlete.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException, Injectable } from '@nestjs/common';

@Injectable()
export class MentorAthleteService {
  constructor(
    @InjectRepository(MentorAthlete)
    private readonly mentorAthleteRepository: Repository<MentorAthlete>,
    readonly logService: LogService,
  ) {}

  async findAllMentorAthletes({ user }: { user: User }) {
    try {
      const movements = await this.mentorAthleteRepository.find({
        relations: ['gymMemberMentors'],
        select: {
          id: true,
          createdAt: true,
          status: true,
          mentors: {
            user: {
              profile: {
                name: true,
              },
            },
          },
        },
        where: [
          {
            mentors: {
              userId: user.id,
            },
          },
        ],
      });

      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: movements,
      };
    } catch (error) {
      console.log(error, 'error');
      this.logService.logData(
        'findAll-movement',
        'no input',
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async assignAthlete() {}
}
