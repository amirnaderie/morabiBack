import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleSeed } from './role-seed.entity';

@Entity('User')
export class UserSeed {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  // @Column({ nullable: false, length: 20 })
  // userName: string;

  // @Column({ length: 40 })
  // userFamily: string;

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

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
