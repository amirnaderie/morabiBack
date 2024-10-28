import { Roles } from 'src/roles/roles.entity';
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

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToMany(() => Roles, (role) => role.permissions)
  @JoinTable({
    name: 'role-permission',
  })
  roles: Roles[];
}
