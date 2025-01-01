import { Tag } from 'src/modules/tag/entities/tag.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { BaseEntity } from 'src/modules/base/base.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Athlete } from 'src/modules/athlete/entities/athlete.entity';

@Entity('Plan')
// @Unique(['planName', 'creatorId'])
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  planName: string;

  @Column({
    type: 'nvarchar',
    length: 500,
  })
  planDescription: string;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  gender: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  weight: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  place: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  level: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  planTime: number;

  @Column({
    type: 'tinyint',
    default: 0,
  })
  state: number;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true,
  })
  weekDays: string;

  @ManyToOne(() => File, (file) => file.plans, { cascade: true })
  @JoinColumn({ name: 'logoId', referencedColumnName: 'id' })
  logo: File;

  @Column({ nullable: true }) logoId: string;

  @ManyToOne(() => User, (user) => user.plans)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @Column() creatorId: string; // Add this line to define creatorId as a column

  @ManyToMany(() => Tag, (tag) => tag.plans, { cascade: true })
  @JoinTable({
    name: 'PlanTag',
  })
  tags: Tag[];

  @ManyToOne(() => Realm, (realm) => realm.plans, { cascade: true })
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @Column({ default: 1 })
  realmId: number;

  @ManyToMany(() => Athlete, (athlete) => athlete.plans, {
    cascade: true,
  })
  @JoinTable({
    name: 'AthletePlan',
  })
  athletes: Athlete[];
}
