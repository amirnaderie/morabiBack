import { GymMember } from './entities/gym-member.entity';
import { Repository } from 'typeorm';
import { LogService } from '../log/providers/log.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGymMemberDto } from './dto/create-gym-member.dto';
import { UpdateGymMemberDto } from './dto/update-gym-member.dto';
import { InternalServerErrorException, Injectable } from '@nestjs/common';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(GymMember)
    private readonly usertypeRepository: Repository<GymMember>,
    readonly logService: LogService,
  ) {}

  async create(createUserTypeDto: CreateGymMemberDto): Promise<GymMember> {
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
    updateGymMemberDto: UpdateGymMemberDto,
  ): Promise<GymMember> {
    try {
      const { categoryId, expireAt, type, userId } = updateGymMemberDto;
      const usertype = await this.usertypeRepository.findOneBy({ id });
      usertype.categoryId = categoryId;
      usertype.expireAt = expireAt;
      usertype.type = type;
      usertype.userId = userId;
      return await this.usertypeRepository.save(usertype);
    } catch (error) {
      this.logService.logData(
        'update-usertype',
        JSON.stringify({ updateUserTypeDto: updateGymMemberDto, id: id }),
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
