import { User } from '../../users/entities/user.entity';
import { Movement } from '../entities/movement.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TagService } from '../../tag/providers/tag.service';
import { FileService } from '../../file/providers/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { UpdateMovementDto } from '../dto/update-movement.dto';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    private readonly tagService: TagService,
    private readonly fileService: FileService,
  ) {}

  async create(createMovementDto: CreateMovementDto, user: User) {
    const { name, description, tags, files } = createMovementDto;

    const tagsEntity = await this.tagService.findById(tags);
    const fileEntity = await this.fileService.findById(files);

    const movement = this.movementRepository.create({
      user: user,
      name: name,
      tags: tagsEntity,
      files: fileEntity,
      description: description,
      isDefault: user.permissions.includes('create-movement-default') ? 1 : 0,
    });
    const result = await this.movementRepository.save(movement);
    delete result.user.permissions;
    delete result.user.roles;
    return result;
  }

  async findAll() {
    return await this.movementRepository.find({
      select: ['user'],
      relations: ['tags', 'files', 'user'],
      // loadRelationIds: true,
    });
  }

  async findOne(id: string) {
    return await this.movementRepository.findOne({
      where: { id: id },
      relations: ['tags', 'files', 'user'],
    });
  }

  async update(updateMovementDto: UpdateMovementDto, id: string) {
    const { name, description, tags, files } = updateMovementDto;
    try {
      const movement = await this.movementRepository.findOneBy({ id });
      const tagsEntity = await this.tagService.findById(tags);
      const fileEntity = await this.fileService.findById(files);

      movement.name = name;
      movement.tags = tagsEntity;
      movement.files = fileEntity;
      movement.description = description;

      const savedMovement = await this.movementRepository.save(movement);

      delete movement.user;
      return savedMovement;
    } catch (error) {
      if (error.message) return error;
      return ' ddd';
    }
  }

  async remove(id: string) {
    return await this.movementRepository.softDelete(id);
  }
}
