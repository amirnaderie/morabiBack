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

    return await this.movementRepository.save(movement);
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
