import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Plan } from 'src/modules/plan/entities/plan.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { AthleteSportPackage } from '../../athlete-sport-package/entities/athlete-sport-package.entity';
import { Form } from 'src/modules/form/entities/form.entity';

@Entity('Athlete')
export class Athlete extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() userId: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  categoryId: number;

  @ManyToMany(() => Plan, (plan) => plan.athletes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'AthletePlan',
  })
  plans: Plan[];

  @ManyToMany(() => Form, (form) => form.athletes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'FormAthlete',
  })
  forms: Form[];

  @ManyToOne(() => User, (user) => user.athletes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Category, (category) => category.athletes)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(
    () => AthleteSportPackage,
    (athleteSportPackage) => athleteSportPackage.athlete,
  )
  athleteSportPackages: AthleteSportPackage[];
}
