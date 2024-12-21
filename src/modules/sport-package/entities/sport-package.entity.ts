import { Exclude } from 'class-transformer';
import { AthleteSportPackage } from 'src/modules/athlete-sport-package/entities/athlete-sport-package.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('SportPackage')
export class SportPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  duration: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: 1,
  })
  durationType: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  cost: number;

  @Column({
    type: 'bit',
    nullable: true,
  })
  isAddedToSite: boolean;

  @ManyToOne(() => Mentor, (mentor) => mentor.sportPackages, {
    onDelete: 'CASCADE',
  })
  mentor: Mentor;

  @OneToMany(
    () => AthleteSportPackage,
    (athleteSportPackage) => athleteSportPackage.sportPackage,
  )
  athleteSportPackages: AthleteSportPackage[];

  @CreateDateColumn({ select: false, type: 'date' })
  createdA: Date;

  @UpdateDateColumn({ select: false, type: 'date' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false, type: 'date' })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;
}
