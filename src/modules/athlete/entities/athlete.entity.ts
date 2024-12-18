import {
  Column,
  Entity,
  // JoinTable,
  ManyToOne,
  // OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { AthleteSportPackage } from '../../athlete-sport-package/entities/athlete-sport-package.entity';
// import { MentorAthlete } from 'src/modules/mentor-athlete/entities/mentor-athlete.entity';

@Entity('Athlete')
export class Athlete {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() userId: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  categoryId: number;

  @ManyToMany(() => Mentor, (mentor) => mentor.athletes, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'MentorAthlete',
  })
  mentors: Mentor[];

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
