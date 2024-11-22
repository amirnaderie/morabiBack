import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../entities/tag.entity';
import { User } from '../../users/entities/user.entity';
import { UtilityService } from 'src/utility/providers/utility.service';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly utilityService: UtilityService,
  ) {}

  async createMany(createTagDto: CreateTagDto, user: User) {
    const { names } = createTagDto;

    const tags = [];
    for (let i = 0; i < names.length; i++) {
      if (!this.utilityService.onlyLettersAndNumbers(names[i]))
        throw new BadRequestException('مقادیر ورودی معتبر نیست');

      const tag = await this.findOneByName(names[i]);

      if (tag) tags.push(tag);
      else {
        const newTag = this.tagRepository.create({
          name: names[i],
          user: user,
        });
        const saveTag = await this.tagRepository.save(newTag);
        delete saveTag.user;
        if (saveTag) tags.push(saveTag);
      }
    }

    return tags;
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(id: string) {
    return await this.tagRepository.findOneBy({ id });
  }

  async findById(ids: string[]): Promise<Tag[]> {
    return await this.tagRepository.find({
      where: { id: In([...ids]) },
    });
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

  async remove(id: string) {
    return await this.tagRepository.softDelete(id);
  }
}
