import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Athlete } from 'src/modules/athlete/entities/athlete.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';

@Entity('MentorAthlete')
export class MentorAthlete {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mentorId: string;

  @Column()
  athleteId: string;

  // @Column({
  //   type: 'bit',
  // })
  // status: boolean;

  @CreateDateColumn({
    type: 'datetime',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorAthlete)
  @JoinColumn({ name: 'mentorId' })
  mentors: Mentor[];

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorAthlete)
  @JoinColumn({ name: 'athleteId' })
  athletes: Athlete[];
}
