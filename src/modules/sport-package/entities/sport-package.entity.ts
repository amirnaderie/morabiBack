import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { AthleteSportPackage } from 'src/modules/athlete-sport-package/entities/athlete-sport-package.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from 'src/modules/category/entities/category.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';

@Entity('SportPackage')
export class SportPackage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  duration: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: 1,
  })
  durationType: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  cost: number;

  @Column({
    type: 'bit',
    nullable: true,
    default: false,
  })
  isAddedToSite: boolean;

  @OneToMany(() => Payment, (payment) => payment.sportPackage)
  payments: Payment[];

  @ManyToOne(() => Mentor, (mentor) => mentor.sportPackages, {
    onDelete: 'CASCADE',
  })
  mentor: Mentor;

  @Column()
  mentorId: string;

  // @ManyToOne(() => Category, (category) => category.sportPackages)
  // category: Category;

  // @Column()
  // categoryId: number;

  @OneToMany(
    () => AthleteSportPackage,
    (athleteSportPackage) => athleteSportPackage.sportPackage,
  )
  athleteSportPackages: AthleteSportPackage[];
}
