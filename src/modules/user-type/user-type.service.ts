import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { Repository } from 'typeorm';
import { UserType } from './entities/user-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LogService } from '../log/providers/log.service';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly usertypeRepository: Repository<UserType>,
    readonly logService: LogService,
  ) {}

  async create(createUserTypeDto: CreateUserTypeDto): Promise<UserType> {
    try {
      const { categoryId, expireAt, type, userId } = createUserTypeDto;
      const usertype = this.usertypeRepository.create({
        type: type,
        userId: userId,
        expireAt: expireAt,
        categoryId: categoryId,
      });
      return await this.usertypeRepository.save(usertype);
    } catch (error) {
      console.log(error);
      this.logService.logData(
        'create-usertype',
        JSON.stringify({ createCategoryDto: createUserTypeDto }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  findAll() {
    return `This action returns all userType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userType`;
  }

  async update(
    id: string,
    updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<UserType> {
    try {
      const { categoryId, expireAt, type, userId } = updateUserTypeDto;
      const usertype = await this.usertypeRepository.findOneBy({ id });
      usertype.categoryId = categoryId;
      usertype.expireAt = expireAt;
      usertype.type = type;
      usertype.userId = userId;
      return await this.usertypeRepository.save(usertype);
    } catch (error) {
      this.logService.logData(
        'update-usertype',
        JSON.stringify({ updateUserTypeDto: updateUserTypeDto, id: id }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userType`;
  }
}
