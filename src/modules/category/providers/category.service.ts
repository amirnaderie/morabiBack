import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { LogService } from 'src/modules/log/providers/log.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly logService: LogService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const { name, parentId } = createCategoryDto;
      const category = this.categoryRepository.create({
        name: name,
      });
      if (parentId) category.parentId = parentId;
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logService.logData(
        'create-category',
        JSON.stringify({ createCategoryDto: createCategoryDto }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      this.logService.logData(
        'findAll-category',
        JSON.stringify({ findAll: 'findAll' }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      return await this.categoryRepository.findOneBy({ id });
    } catch (error) {
      this.logService.logData(
        'findOne-category',
        JSON.stringify({ findOne: 'findOne' }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const { name, parentId } = updateCategoryDto;

      const category = await this.categoryRepository.findOneBy({ id });
      if (!category) throw new NotFoundException('دسته‌بندی یافت نشد');

      category.name = name;
      if (parentId) category.parentId = parentId;
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logService.logData(
        'update-category',
        JSON.stringify({ updateCategoryDto: updateCategoryDto, id }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
