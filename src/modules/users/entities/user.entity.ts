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
import { Role } from 'src/modules/role/entities/role.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';

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

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @ManyToMany(() => Role, (role) => role.permissions)
  permissions?: string[];

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToMany(() => Movement, (movement) => movement.user, { eager: true })
  movements: Movement[];

  @OneToMany(() => Tag, (tag) => tag.user, { eager: true })
  tags: Tag[];

  @OneToMany(() => File, (file) => file.user, { eager: true })
  files: File[];
}
