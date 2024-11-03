import { User } from 'src/modules/users/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Movement } from 'src/modules/movement/entities/movement.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: '100',
    unique: true,
  })
  name: string;

  @CreateDateColumn()
  createdA: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @ManyToMany(() => Movement, (movement) => movement.tags, {
    // eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'movement-tag',
  })
  movements: Movement[];

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;
}
