import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createMany(createTagDto: CreateTagDto) {
    const { names } = createTagDto;
    console.log(545454);
    const tags = [];
    for (let i = 0; i < names.length; i++) {
      const tag = await this.tagRepository.upsert(
        {
          name: names[i],
        },
        ['name'],
      );
      tags.push(tag);
    }

    console.log(tags);
    return tags;
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
