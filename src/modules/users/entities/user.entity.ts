import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from 'src/modules/tasks/task.entity';
import { Roles } from 'src/modules/roles/roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 20 })
  userName: string;

  @Column({ length: 40 })
  userFamily: string;

  @Column({ length: 100 })
  password: string;

  @Column({ unique: true, length: 12 })
  userMobile: string;

  @ManyToMany(() => Roles, (role) => role.users, { eager: true })
  @JoinTable({ name: 'user_roles' })
  roles: Roles[];

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
