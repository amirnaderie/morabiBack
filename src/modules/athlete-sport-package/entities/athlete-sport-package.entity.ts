import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { Athlete } from '../../athlete/entities/athlete.entity';
import { Exclude } from 'class-transformer';
import { SportPackage } from 'src/modules/sport-package/entities/sport-package.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('AthleteSportPackage')
export class AthleteSportPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() athleteId: string;
  @Column() mentorId: string;
  @Column() sportPackageId: number;

  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @ManyToOne(() => Athlete, (athlete) => athlete.athleteSportPackages)
  @JoinColumn({ name: 'athleteId' })
  athlete: Athlete;

  @ManyToOne(() => Mentor, (mentor) => mentor.mentorSportPackages)
  @JoinColumn({ name: 'mentorId' })
  mentor: Mentor;

  @ManyToOne(
    () => SportPackage,
    (sportPackage) => sportPackage.athleteSportPackages,
  )
  @JoinColumn({ name: 'packageId' })
  sportPackage: SportPackage;
}
