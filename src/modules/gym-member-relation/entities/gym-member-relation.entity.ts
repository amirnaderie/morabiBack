import { GymMember } from 'src/modules/gym-member/entities/gym-member.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('GymMemberRelation')
export class GymMemberRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mentorId: string;

  @CreateDateColumn({
    type: 'datetime',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'datetime' })
  updatedAt: Date;

  @ManyToOne(() => GymMember, (gymMember) => gymMember.gymMemberRelations)
  @JoinColumn({ name: 'mentorId' })
  gymMembers: GymMember[];
}
