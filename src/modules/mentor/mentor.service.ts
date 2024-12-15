import { Mentor } from './entities/mentor.entity';
import { Repository } from 'typeorm';
import { LogService } from '../log/providers/log.service';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerErrorException, Injectable } from '@nestjs/common';

@Injectable()
export class MentorService {
  constructor(
    @InjectRepository(Mentor)
    private readonly mentorRepository: Repository<Mentor>,
    readonly logService: LogService,
  ) {}

  async create(createMentorDto: CreateMentorDto): Promise<Mentor> {
    try {
      const { categoryId, userId } = createMentorDto;
      const mentor = this.mentorRepository.create({
        userId: userId,
        categoryId: categoryId,
      });
      return await this.mentorRepository.save(mentor);
    } catch (error) {
      console.log(error);
      this.logService.logData(
        'create-mentor',
        JSON.stringify({ createMentorDto }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  findAll() {
    try {
      return this.mentorRepository.find();
    } catch (error) {
      console.log(error);
      this.logService.logData(
        'create-mentor',
        'no input',
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new InternalServerErrorException(
        'مشکل فنی رخ داده است. در حال رفع مشکل هستیم . ممنون از شکیبایی شما',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} userType`;
  }

  async update(id: string, updateMentorDto: UpdateMentorDto): Promise<Mentor> {
    try {
      const { categoryId, userId } = updateMentorDto;
      const usertype = await this.mentorRepository.findOneBy({ id });
      usertype.categoryId = categoryId;
      usertype.userId = userId;
      return await this.mentorRepository.save(usertype);
    } catch (error) {
      this.logService.logData(
        'update-usertype',
        JSON.stringify({ updateMentorDto, id }),
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
