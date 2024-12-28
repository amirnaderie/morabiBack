import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleSeed } from './role-seed.entity';
import { BaseEntity } from './base.entity';

@Entity('User')
export class UserSeed extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  // @Column({ nullable: false, length: 20 })
  // userName: string;

  // @Column({ length: 40 })
  // userFamily: string;

  @Column({ length: 100, nullable: true })
  family: string;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true, length: 12 })
  userMobile: string;

  @ManyToMany(() => RoleSeed, (role) => role.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'UserRoles' })
  roles: RoleSeed[];
}
