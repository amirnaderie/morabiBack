import { Injectable } from '@nestjs/common';
import { CreateMentorPackageDto } from './dto/create-mentor-package.dto';
import { UpdateMentorPackageDto } from './dto/update-mentor-package.dto';

@Injectable()
export class MentorPackageService {
  create(createMentorPackageDto: CreateMentorPackageDto) {
    return 'This action adds a new mentorPackage';
  }

  findAll() {
    return `This action returns all mentorPackage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mentorPackage`;
  }

  update(id: number, updateMentorPackageDto: UpdateMentorPackageDto) {
    return `This action updates a #${id} mentorPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} mentorPackage`;
  }
}
