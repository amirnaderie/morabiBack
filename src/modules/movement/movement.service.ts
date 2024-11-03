import { Injectable } from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Repository } from 'typeorm';
import { Movement } from './entities/movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { FileService } from '../file/providers/file.service';
import { TagService } from '../tag/tag.service';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    private readonly fileService: FileService,
    private readonly tagService: TagService,
  ) {}

  async create(
    user: User,
    createMovementDto: CreateMovementDto,
    files: {
      video?: Express.Multer.File;
      poster?: Express.Multer.File;
    },
    req: Request | any,
  ) {
    const { name, description, tags } = createMovementDto;

    const movement = this.movementRepository.create({
      name: name,
      type: user.permissions.includes('create-movement-default') ? 1 : 0,
      description: description,
      user: user,
    });

    const createTags = await this.tagService.createMany(
      {
        names: tags,
      },
      user,
    );

    if (createTags) {
      movement.tags = createTags;
    }

    const createdMovement = await this.movementRepository.save(movement);

    if (files?.video?.[0])
      await this.fileService.handleFileUpload(
        files?.video?.[0],
        req,
        user,
        createdMovement,
      );

    if (files?.poster?.[0])
      await this.fileService.handleFileUpload(
        files?.poster?.[0],
        req,
        user,
        createdMovement,
      );

    const result = await this.movementRepository.findOne({
      where: { id: createdMovement.id },
      relations: {
        files: true,
        tags: true,
      },
    });
    return result;
  }

  findAll() {
    return `This action returns all movement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movement`;
  }

  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} ${updateMovementDto} movement`;
  }

  remove(id: number) {
    return `This action removes a #${id} movement`;
  }
}
