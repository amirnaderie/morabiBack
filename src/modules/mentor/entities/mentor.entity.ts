import { User } from 'src/modules/users/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinTable,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorAthlete } from 'src/modules/mentor-athlete/entities/mentor-athlete.entity';

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

  @OneToMany(() => MentorAthlete, (mentorAthlete) => mentorAthlete.mentors, {
    cascade: true,
  })
  @JoinTable({
    name: 'MentorAthlete',
  })
  mentorAthlete: MentorAthlete[];

  @ManyToOne(() => User, (user) => user.movements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
