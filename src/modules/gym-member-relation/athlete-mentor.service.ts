import { Injectable } from '@nestjs/common';
import { CreateAthleteMentorDto } from './dto/create-athlete-mentor.dto';
import { UpdateAthleteMentorDto } from './dto/update-athlete-mentor.dto';

@Injectable()
export class AthleteMentorService {
  create(createAthleteMentorDto: CreateAthleteMentorDto) {
    return 'This action adds a new athleteMentor';
  }

  findAll() {
    return `This action returns all athleteMentor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} athleteMentor`;
  }

  update(id: number, updateAthleteMentorDto: UpdateAthleteMentorDto) {
    return `This action updates a #${id} athleteMentor`;
  }

  remove(id: number) {
    return `This action removes a #${id} athleteMentor`;
  }
}
