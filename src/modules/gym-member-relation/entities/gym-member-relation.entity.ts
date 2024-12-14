import { GymMember } from 'src/modules/gym-member/entities/gym-member.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('GymMemberRelation')
export class GymMemberRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mentorId: string;

  @Column()
  athleteId: string;

  @Column({
    type: 'bit',
  })
  status: boolean;

  @CreateDateColumn({
    type: 'datetime',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(
    () => GymMember,
    (gymMember) => gymMember.gymMemberMentorsRelations,
  )
  @JoinColumn({ name: 'mentorId' })
  gymMemberMentors: GymMember[];

  @ManyToOne(
    () => GymMember,
    (gymMember) => gymMember.gymMemberAthletesRelations,
  )
  @JoinColumn({ name: 'athleteId' })
  gymMemberAthletes: GymMember[];
}
