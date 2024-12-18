import { Injectable } from '@nestjs/common';
import { CreateSportPackageDto } from './dto/create-sport-package.dto';
import { UpdateSportPackageDto } from './dto/update-sport-package.dto';

@Injectable()
export class SportPackageService {
  create(createSportPackageDto: CreateSportPackageDto) {
    return 'This action adds a new sportPackage';
  }

  findAll() {
    return `This action returns all sportPackage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sportPackage`;
  }

  update(id: number, updateSportPackageDto: UpdateSportPackageDto) {
    return `This action updates a #${id} sportPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} sportPackage`;
  }
}
