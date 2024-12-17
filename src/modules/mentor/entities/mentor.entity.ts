import { User } from 'src/modules/users/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { SportPackage } from 'src/modules/sport-package/entities/sport-package.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Athlete } from 'src/modules/athlete/entities/athlete.entity';
import { AthleteSportPackage } from 'src/modules/athlete-sport-package/entities/athlete-sport-package.entity';

@Entity('Mentor')
export class Mentor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  categoryId: number;

  @CreateDateColumn({
    type: 'datetime',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.mentors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @ManyToMany(() => Athlete, (athlete) => athlete.mentors, { cascade: true })
  @JoinTable({
    name: 'MentorAthlete',
  })
  athletes: Athlete[];

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
