import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSeed } from './user-seed.entity';
import { PermissionSeed } from './permission-seed.entity';

@Entity('role')
export class RoleSeed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  enName: string;

  @CreateDateColumn()
  createdA: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedA: Date;

  @ManyToMany(() => UserSeed, (user) => user.roles)
  users: UserSeed[];

  @ManyToMany(() => PermissionSeed, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role-permission',
  })
  permissions: PermissionSeed[];
}
