import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { Athlete } from '../../athlete/entities/athlete.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { SportPackage } from 'src/modules/sport-package/entities/sport-package.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('AthleteSportPackage')
export class AthleteSportPackage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() athleteId: string;
  @Column() mentorId: string;
  @Column() sportPackageId: number;

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
  @JoinColumn({ name: 'sportPackageId' })
  sportPackage: SportPackage;
}
