import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Category } from 'src/modules/category/entities/category.entity';

export type UserTypes = 'mentor' | 'athlete';
export const userTypes = {
  MENTOR: 'mentor' as UserTypes,
  ATHLETE: 'athlete' as UserTypes,
};

@Entity('user-type')
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  userId: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  categoryId: number;

  @Column({
    nullable: false,
    enum: Object.values(userTypes),
  })
  type: UserTypes;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  expireAt: Date | null;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.userTypes)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @CreateDateColumn({
    type: 'date',
    select: false,
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false, type: 'date' })
  updatedAt: Date;
}
