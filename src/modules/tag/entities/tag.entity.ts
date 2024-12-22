import { User } from 'src/modules/users/entities/user.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from 'src/modules/plan/entities/plan.entity';
import { BaseEntity } from 'src/modules/base/base.entity';

@Entity('Tag')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: '100',
    unique: true,
  })
  name: string;

  @ManyToMany(() => Movement, (movement) => movement.tags, {
    onDelete: 'CASCADE',
  })
  movements: Movement[];

  @ManyToMany(() => Plan, (plan) => plan.tags, {
    onDelete: 'CASCADE',
  })
  plans: Movement[];

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;
}
