import { Module } from '@nestjs/common';
import { RealmController } from './realm.controller';
import { RealmService } from './providers/realm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Realm } from './entities/realm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Realm])],
  controllers: [RealmController],
  providers: [RealmService],
  exports: [RealmService],
})
export class RealmModule {}
