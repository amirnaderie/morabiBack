import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profile')
@Unique(['userId'])
export class Profile {
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

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
    type: 'date',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false, type: 'date' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;
}
