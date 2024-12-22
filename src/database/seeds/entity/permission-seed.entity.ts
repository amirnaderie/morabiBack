import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleSeed } from './role-seed.entity';
import { BaseEntity } from './base.entity';

@Entity('Permission')
export class PermissionSeed extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  enName: string;

  @ManyToMany(() => RoleSeed, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'RolePermission',
  })
  roles: RoleSeed[];
}
