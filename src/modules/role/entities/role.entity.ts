import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
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
    name: 'role-permission',
  })
  permissions: Permission[];
}
