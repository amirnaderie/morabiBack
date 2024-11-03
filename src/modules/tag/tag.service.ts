import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createMany(createTagDto: CreateTagDto, user: User) {
    const { names } = createTagDto;

    const tags = [];
    for (let i = 0; i < names.length; i++) {
      const tag = await this.findOneByName(names[i]);
      if (tag) tags.push(tag);
      else {
        const newTag = this.tagRepository.create({
          name: names[i],
          user: user,
        });
        const saveTag = await this.tagRepository.save(newTag);
        if (saveTag) tags.push(saveTag);
      }
    }

    return tags;
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async findOneByName(name: string) {
    return await this.tagRepository.findOne({
      where: { name: name },
      relations: {
        movements: false,
      },
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} ${updateTagDto} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
