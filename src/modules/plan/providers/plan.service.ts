import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto, UpdatePlanDto } from '../dto/create-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../entities/plan.entity';
import { Repository } from 'typeorm';
import { TagService } from 'src/modules/tag/providers/tag.service';
import { FileService } from 'src/modules/file/providers/file.service';
import { LogService } from 'src/modules/log/providers/log.service';
import { User } from 'src/modules/users/entities/user.entity';
import { UtilityService } from 'src/utility/providers/utility.service';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { MovementService } from 'src/modules/movement/providers/movement.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    private readonly tagService: TagService,
    private readonly fileService: FileService,
    private readonly logService: LogService,
    private readonly utilityService: UtilityService,
    @Inject(forwardRef(() => MovementService))
    private readonly movementService: MovementService,
  ) {}
  async create(createPlanDto: CreatePlanDto, user: User, req: Request) {
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

    if (
      !(
        this.utilityService.onlyLettersAndNumbers(planName) &&
        this.utilityService.onlyLettersAndNumbers(planDescription)
      )
    )
      throw new BadRequestException('مقادیر ورودی معتبر نیست');
    try {
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
  async copy(id: string, userInfo: User, req: Request) {
    const foundPlan = await this.planRepository.findOne({
      where: {
        id: id,
        realmId: (req as any).subdomainId,
        user: { id: userInfo.id },
      },
      relations: ['tags', 'logo', 'user'],
    });

    const {
      user,
      planName,
      tags,
      logo,
      planDescription,
      gender,
      level,
      place,
      planTime,
      state,
      weekDays,
      weight,
      realmId,
    } = foundPlan;
    try {
      const plan = this.planRepository.create({
        user,
        planName: `کپی ${planName}`,
        tags,
        logo,
        planDescription,
        gender,
        level,
        place,
        planTime,
        state,
        weekDays,
        weight,
        realmId,
      });
      const result = await this.planRepository.save(plan);
      delete result.user.permissions;
      delete result.user.roles;

      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: {
          id: result.id,
          planName: `کپی ${planName}`,
          tags: result.tags,
          logo: {
            storedName: result.logo.storedName,
            realmId: result.logo.realmId,
          },
          gender,
          level,
          place,
          state,
          weight,
        },
      };
    } catch (error) {
      this.logService.logData(
        'copy-plan',
        JSON.stringify({ copiedPlanData: foundPlan, user: user }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      if (error.message.includes('Violation of UNIQUE KEY constraint'))
        throw new ConflictException(
          `نام برنامه "${`کپی ${planName}`}" تکراری است`,
        );
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
          logo: {
            storedName: true,
            realmId: true,
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

  async findOne(id: string, userId: string, req: Request) {
    try {
      const plan = await this.planRepository.findOne({
        where: {
          id: id,
          realmId: (req as any).subdomainId,
          user: { id: userId },
        },

        relations: ['tags', 'logo', 'user'],
        select: {
          user: {
            realmId: true,
          },
          logo: {
            id: true,
            storedName: true,
            realmId: true,
          },
        },
      });

      const weeksData = JSON.parse(plan.weekDays);
      const newWeeksDate = await Promise.all(
        weeksData.map(async (week: any) => {
          if (week.isRest) return week;

          const circuits = await Promise.all(
            week.circuits.map(async (circuit: any) => {
              const circuitExercises = await Promise.all(
                circuit.circuitExercises.map(async (circuitExercise: any) => {
                  try {
                    const { data: exerciseData } =
                      await this.movementService.findOne(
                        circuitExercise.movementId,
                        req,
                      );

                    return {
                      ...circuitExercise,
                      movementMovie: (exerciseData as any).files[0]?.storedName,
                      movementPoster: (exerciseData as any).files[1]
                        ?.storedName,
                      movieRealmId: (exerciseData as any).files[0]?.realmId,
                      posterRealmId: (exerciseData as any).files[1]?.realmId,
                      exerciseName: exerciseData.name,
                    };
                  } catch (error) {
                    console.error(`Error fetching exercise data: ${error}`);
                    return circuitExercise;
                  }
                }),
              );

              return { ...circuit, circuitExercises };
            }),
          );

          return { ...week, circuits };
        }),
      );
      plan.weekDays = JSON.stringify(newWeeksDate);
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

  async update(
    id: string,
    updatePlanDto: UpdatePlanDto,
    user: User,
    req: Request,
  ) {
    const {
      gender,
      level,
      logo,
      place,
      planDescription,
      planName,
      planTime,
      state,
      tags,
      weekDays,
      weight,
    } = updatePlanDto;

    if (
      !(
        this.utilityService.onlyLettersAndNumbers(planName) &&
        this.utilityService.onlyLettersAndNumbers(planDescription)
      )
    )
      throw new BadRequestException('مقادیر ورودی معتبر نیست');

    const plan = await this.planRepository.findOne({
      where: {
        user: { id: user.id },
        id: id,
        realmId: (req as any).subdomainId,
      },
      relations: {
        logo: true,
      },
    });
    if (!plan) throw new NotFoundException('موردی یافت نشد');
    try {
      const tagsEntity = await this.tagService.findById(tags);
      const fileEntity = await this.fileService.findById([logo]);

      const updatedPlan = await this.planRepository.save({
        id,
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
      delete updatedPlan.user;

      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: updatedPlan,
      };
    } catch (error) {
      this.logService.logData(
        'update-plan',
        JSON.stringify({ createPlanDto: updatePlanDto, user: user }),
        error?.stack ? error.stack : 'error not have message!!',
      );

      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async remove(id: string, user: User, req: Request) {
    const plan = await this.planRepository.find({
      where: {
        user: { id: user.id },
        id: id,
        realmId: (req as any).subdomainId,
      },
    });
    if (!plan) throw new NotFoundException('موردی یافت نشد');
    return this.planRepository.remove(plan);
  }
  async findPlansByMovementId(movementId: string) {
    try {
      const retVal = await this.planRepository
        .createQueryBuilder('entity')
        .where('entity.weekDays LIKE :searchPattern', {
          searchPattern: `%"movementId":"${movementId}"%`,
        })
        .getMany();

      return retVal.length;
    } catch (error) {
      return 0;
    }
  }
}
