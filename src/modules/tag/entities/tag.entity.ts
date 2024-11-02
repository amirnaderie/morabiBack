import { User } from 'src/modules/users/entities/user.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  JoinColumn,
  ManyToMany,
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

  @ManyToMany(() => Movement, (movement) => movement.tags, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'movement-tag',
  })
  movements: Movement[];

  @ManyToOne(() => User, (user) => user.tags, { eager: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;
}
