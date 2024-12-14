import { User } from '../../users/entities/user.entity';
import { LogService } from '../../log/providers/log.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GymMemberRelation } from '../entities/gym-member-relation.entity';
import { InternalServerErrorException, Injectable } from '@nestjs/common';

@Injectable()
export class GymMemberRelationService {
  constructor(
    @InjectRepository(GymMemberRelation)
    private readonly gymMemberRelationRepository: Repository<GymMemberRelation>,
    readonly logService: LogService,
  ) {}

  async findAllMentorAthletes({ user }: { user: User }) {
    try {
      console.log(user, 'user');
      const movements = await this.gymMemberRelationRepository.find({
        relations: ['gymMemberMentors'],
        select: {
          id: true,
          createdAt: true,
          status: true,
          gymMemberAthletes: {
            user: {
              profile: {
                name: true,
              },
            },
          },
        },
        where: [
          {
            gymMemberMentors: {
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
