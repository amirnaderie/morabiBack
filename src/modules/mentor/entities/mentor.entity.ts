import { User } from 'src/modules/users/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { SportPackage } from 'src/modules/sport-package/entities/sport-package.entity';
import { AthleteSportPackage } from 'src/modules/athlete-sport-package/entities/athlete-sport-package.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Mentor')
export class Mentor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.mentors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(() => User, (user) => user.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => SportPackage, (sportPackage) => sportPackage.mentor, {
    cascade: true,
  })
  sportPackages: SportPackage[];

  @OneToMany(
    () => AthleteSportPackage,
    (athleteSportPackage) => athleteSportPackage.mentor,
  )
  mentorSportPackages: AthleteSportPackage[];
}
