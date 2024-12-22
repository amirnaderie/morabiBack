import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSeed } from './user-seed.entity';
import { PermissionSeed } from './permission-seed.entity';
import { BaseEntity } from './base.entity';

@Entity('Role')
export class RoleSeed extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  enName: string;

  @ManyToMany(() => UserSeed, (user) => user.roles)
  users: UserSeed[];

  @ManyToMany(() => PermissionSeed, (permission) => permission.roles, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'RolePermission',
  })
  permissions: PermissionSeed[];
}
