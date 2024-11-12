import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Realm } from '../entities/realm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RealmService {
  constructor(
    @InjectRepository(Realm)
    private readonly realmRepository: Repository<Realm>,
  ) {}

  async getRealmIdByName(name: string): Promise<number> {
    const realm: Realm = await this.realmRepository.findOne({
      where: { name },
    });
    if (!realm) {
      console.log('err : name', name);
      throw new NotFoundException(`خطا در واکشی اطلاعات`);
    }

    return realm.id;
  }
  async getRealmById(id: number): Promise<Realm> {
    const realm: Realm = await this.realmRepository.findOne({
      where: { id },
    });
    if (!realm) {
      console.log('err : id', id);

      throw new NotFoundException(`خطا در واکشی اطلاعات`);
    }

    return realm;
  }
}
