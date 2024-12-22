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
import { RoleSeed } from './role-seed.entity';

@Entity('Permission')
export class PermissionSeed {
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

  @ManyToMany(() => RoleSeed, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'RolePermission',
  })
  roles: RoleSeed[];
}
