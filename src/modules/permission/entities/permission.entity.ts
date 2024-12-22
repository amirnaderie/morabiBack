import { BaseEntity } from 'src/modules/base/base.entity';
import { Role } from 'src/modules/role/entities/role.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Permission')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  enName: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: 'RolePermission',
  })
  roles: Role[];
}
