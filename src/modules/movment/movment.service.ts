import { Injectable } from '@nestjs/common';
import { CreateMovmentDto } from './dto/create-movment.dto';
import { UpdateMovmentDto } from './dto/update-movment.dto';

@Injectable()
export class MovmentService {
  create(createMovmentDto: CreateMovmentDto) {
    return 'This action adds a new movment';
  }

  findAll() {
    return `This action returns all movment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movment`;
  }

  update(id: number, updateMovmentDto: UpdateMovmentDto) {
    return `This action updates a #${id} movment`;
  }

  remove(id: number) {
    return `This action removes a #${id} movment`;
  }
}
