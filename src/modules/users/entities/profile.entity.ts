import {
  Column,
  Entity,
  Unique,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/modules/base/base.entity';

@Entity('Profile')
@Unique(['userId'])
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  userId: string;

  @Column({ nullable: true, length: 50 })
  name: string | null;

  @Column({ length: 50 })
  family: string | null;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthdate: Date | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  weight: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  height: number | null;

  @Column({
    type: 'nvarchar',
    length: 250,
    nullable: true,
  })
  info: string | null;

  @Column({
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  descriptionDisease: string | null;

  @Column({
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  sportsBackground: string | null;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
