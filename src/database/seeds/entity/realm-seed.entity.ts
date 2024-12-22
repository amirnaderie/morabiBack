import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('Realm')
export class RealmSeed extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;
}
