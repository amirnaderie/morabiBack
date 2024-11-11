import { User } from '../../users/entities/user.entity';
import { Movement } from '../entities/movement.entity';
import { Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { TagService } from '../../tag/providers/tag.service';
import { FileService } from '../../file/providers/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { UpdateMovementDto } from '../dto/update-movement.dto';
import { LogService } from 'src/modules/log/providers/log.service';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    private readonly tagService: TagService,
    private readonly fileService: FileService,
    private readonly logService: LogService,
  ) {}

  async create(createMovementDto: CreateMovementDto, user: User, req: Request) {
    try {
      const { name, description, tags, files, screenSeconds } =
        createMovementDto;

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
        error?.message ? error.message : 'error not have message!!',
      );
      if (error.message.includes('Violation of UNIQUE KEY constraint'))
        throw new ConflictException('اطلاعات حرکت تکراری است');
      else
        throw new InternalServerErrorException(
          'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
        );
    }
  }

  async findAll(userId: string, req: Request) {
    try {
      const movements = await this.movementRepository.find({
        select: ['user'],
        relations: ['tags', 'files', 'user'],
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
        error?.message ? error.message : 'error not have message!!',
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
      return {
        message: `عملیات با موفقیت انجام پذیرفت`,
        data: movement,
      };
    } catch (error) {
      this.logService.logData(
        'findOne-movement',
        JSON.stringify({ id: id }),
        error?.message ? error.message : 'error not have message!!',
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
    try {
      const { name, description, tags, files, screenSeconds } =
        updateMovementDto;
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

      if (movement.files && movement.files.length > 0) {
        for (let i = 0; i < movement.files.length; i++) {
          await this.fileService.delete(movement.files[i].id, user);
        }
      }

      const tagsEntity = await this.tagService.findById(tags);
      const fileEntity = await this.fileService.findById(files);

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
        error?.message ? error.message : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async remove(id: string, user: User, req: Request) {
    try {
      const movement = await this.movementRepository.findOne({
        where: { id: id },
        relations: { files: true },
      });

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
        error?.message ? error.message : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }
}
