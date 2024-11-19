import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePlanDto, UpdatePlanDto } from '../dto/create-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../entities/plan.entity';
import { Repository } from 'typeorm';
import { TagService } from 'src/modules/tag/providers/tag.service';
import { FileService } from 'src/modules/file/providers/file.service';
import { LogService } from 'src/modules/log/providers/log.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    private readonly tagService: TagService,
    private readonly fileService: FileService,
    private readonly logService: LogService,
  ) {}
  async create(createPlanDto: CreatePlanDto, user: User, req: Request) {
    try {
      const {
        planDescription,
        planName,
        planTime,
        state,
        weekDays,
        gender,
        level,
        logo,
        place,
        tags,
        weight,
      } = createPlanDto;

      const tagsEntity = await this.tagService.findById(tags);
      const fileEntity = await this.fileService.findById([logo]);

      const plan = this.planRepository.create({
        user: user,
        planName,
        tags: tagsEntity,
        logo: fileEntity[0],
        planDescription,
        gender,
        level,
        place,
        planTime,
        state,
        weekDays: JSON.stringify(weekDays),
        weight,
        realmId: (req as any).subdomainId || 1,
      });
      const result = await this.planRepository.save(plan);
      delete result.user.permissions;
      delete result.user.roles;
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: result,
      };
    } catch (error) {
      this.logService.logData(
        'create-plan',
        JSON.stringify({ createPlanDto: createPlanDto, user: user }),
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

  async findAll(userId: string, req: Request) {
    try {
      const plans = await this.planRepository.find({
        relations: ['logo', 'user'],
        select: {
          id: true,
          planName: true,
          gender: true,
          level: true,
          place: true,
          state: true,
          weight: true,
          user: {
            realmId: true,
          },
          logo: {
            storedName: true,
          },
        },
        where: [
          {
            user: {
              id: userId, // Ensure you have a variable named creatorId with the proper value
            },
            realmId: (req as any).subdomainId,
          },
        ],
      });
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: plans,
      };
    } catch (error) {
      this.logService.logData(
        'findAll-plan',
        'no input',
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async findOne(id: string, req: Request) {
    try {
      const plan = await this.planRepository.findOne({
        where: { id: id, realmId: (req as any).subdomainId },
        relations: ['tags', 'logo', 'user'],
        select: {
          user: {
            realmId: true,
          },
          logo: {
            storedName: true,
          },
        },
      });
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: plan,
      };
    } catch (error) {
      this.logService.logData(
        'findOne-plan',
        JSON.stringify({ id: id }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
