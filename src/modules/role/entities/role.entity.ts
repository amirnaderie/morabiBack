import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Role')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  enName: string;

  @ManyToOne(() => Realm, (realm) => realm.roles)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @Column({ default: 1 }) realmId: number;

  @ManyToMany(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'RolePermission',
  })
  permissions: Permission[];
}
