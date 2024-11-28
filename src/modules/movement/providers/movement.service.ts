import { User } from '../../users/entities/user.entity';
import { Movement } from '../entities/movement.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TagService } from '../../tag/providers/tag.service';
import { FileService } from '../../file/providers/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { UpdateMovementDto } from '../dto/update-movement.dto';
import { LogService } from 'src/modules/log/providers/log.service';
import { UtilityService } from 'src/utility/providers/utility.service';
import { PlanService } from 'src/modules/plan/providers/plan.service';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    private readonly tagService: TagService,
    private readonly fileService: FileService,
    private readonly logService: LogService,
    private readonly utilityService: UtilityService,
    private readonly planService: PlanService,
  ) {}

  async create(createMovementDto: CreateMovementDto, user: User, req: Request) {
    const { name, description, tags, files, screenSeconds } = createMovementDto;

    if (
      !(
        this.utilityService.onlyLettersAndNumbers(name) &&
        this.utilityService.onlyLettersAndNumbers(description)
      )
    )
      throw new BadRequestException('مقادیر ورودی معتبر نیست');
    try {
      const tagsEntity = await this.tagService.findById(tags);
      const fileEntity = await this.fileService.findById(files);

      const movement = this.movementRepository.create({
        user: user,
        name: name,
        tags: tagsEntity,
        files: fileEntity,
        description: description,
        screenSeconds: screenSeconds,
        isDefault: user.permissions.includes('create-movement-default')
          ? true
          : false,
        realmId: (req as any).subdomainId || 1,
      });
      const result = await this.movementRepository.save(movement);
      delete result.user.permissions;
      delete result.user.roles;
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: result,
      };
    } catch (error) {
      this.logService.logData(
        'create-movement',
        JSON.stringify({ createMovementDto: createMovementDto, user: user }),
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
      const movements = await this.movementRepository.find({
        relations: ['tags', 'files', 'user'],
        select: {
          id: true,
          isDefault: true,
          name: true,
          creatorId: true,
          tags: {
            id: true,
            name: true,
          },
          files: {
            id: true,
            mimetype: true,
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
          { isDefault: true, realmId: (req as any).subdomainId },
        ],
      });
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: movements,
      };
    } catch (error) {
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

  async findOne(id: string, req: Request) {
    try {
      const movement = await this.movementRepository.findOne({
        where: { id: id, realmId: (req as any).subdomainId },
        relations: ['tags', 'files', 'user'],
      });
      delete movement.user;
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: movement,
      };
    } catch (error) {
      this.logService.logData(
        'findOne-movement',
        JSON.stringify({ id: id }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async update(
    updateMovementDto: UpdateMovementDto,
    id: string,
    user: User,
    req: Request,
  ) {
    const { name, description, tags, files, screenSeconds } = updateMovementDto;
    if (!this.utilityService.onlyLettersAndNumbers(description))
      throw new BadRequestException('مقادیر ورودی معتبر نیست');
    let tagsEntity;
    let fileEntity;
    try {
      tagsEntity = await this.tagService.findById(tags);
      fileEntity = await this.fileService.findById(files);
    } catch (error) {
      throw new BadRequestException('خطا در ثبت اطلاعات');
    }

    const movement = await this.movementRepository.findOne({
      where: {
        user: { id: user.id },
        id: id,
        realmId: (req as any).subdomainId,
      },
      relations: {
        files: true,
      },
    });
    if (!movement) throw new NotFoundException('موردی یافت نشد');
    // remove files if movement not have file in update
    if (movement.files && movement.files.length > 0 && files.length === 0) {
      if (!movement)
        throw new BadRequestException('اطلاعات وارد شده معتبر نیست');
    }
    try {
      // remove old files after get new file in update
      if (movement.files && movement.files.length > 0 && files.length > 0) {
        if (
          movement.files[0].id !== files[0] &&
          movement.files[1].id !== files[0]
        ) {
          for (let i = 0; i < movement.files.length; i++) {
            await this.fileService.delete(movement.files[i].id, user);
          }
        }
      }

      movement.name = name;
      movement.tags = tagsEntity;
      movement.files = fileEntity;
      movement.description = description;
      movement.screenSeconds = screenSeconds;

      const savedMovement = await this.movementRepository.save(movement);

      delete movement.user;

      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: savedMovement,
      };
    } catch (error) {
      this.logService.logData(
        'update-movement',
        JSON.stringify({ updateMovementDto: updateMovementDto, id: id }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async remove(id: string, user: User, req: Request) {
    const movement = await this.movementRepository.findOne({
      where: { id: id },
      relations: { files: true },
    });

    const plansUsedTheMovement =
      await this.planService.findPlansByMovementId(id);
    if (plansUsedTheMovement > 0)
      throw new ConflictException(
        'این حرکت در برنامه ها استفاده شده و امکان حذف آن وجود ندارد',
      );
    try {
      await this.movementRepository.delete({
        id: id,
        user: { id: user.id },
        realmId: (req as any).subdomainId || 1,
      });
      if (movement.files.length) {
        for (let i = 0; i < movement.files.length; i++) {
          await this.fileService.delete(movement.files[i].id, user);
        }
      }
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
      };
    } catch (error) {
      this.logService.logData(
        'remove-movement',
        JSON.stringify({ id: id }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }
}
