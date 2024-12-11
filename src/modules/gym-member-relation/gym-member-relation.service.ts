import { Injectable } from '@nestjs/common';
import { CreateGymMemberRelationDto } from './dto/create-gym-member-relation.dto';
import { UpdateGymMemberRelationDto } from './dto/update-gym-member-relation.dto';

@Injectable()
export class GymMemberRelationService {
  create(createGymMemberRelationDto: CreateGymMemberRelationDto) {
    return 'This action adds a new gymMemberRelation';
  }

  findAll() {
    return `This action returns all gymMemberRelation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gymMemberRelation`;
  }

  update(id: number, updateGymMemberRelationDto: UpdateGymMemberRelationDto) {
    return `This action updates a #${id} gymMemberRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} gymMemberRelation`;
  }
}
