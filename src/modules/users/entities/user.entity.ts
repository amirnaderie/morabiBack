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

  @Column({ length: 100, select: false })
  password: string;

  @Column({ unique: true, length: 12 })
  userMobile: string;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @ManyToMany(() => Role, (role) => role.permissions)
  permissions?: string[];

  @OneToMany(() => Movement, (movement) => movement.user)
  movements: Movement[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => File, (file) => file.user)
  files: File[];
}
