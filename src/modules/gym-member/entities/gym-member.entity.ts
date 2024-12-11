import { User } from 'src/modules/users/entities/user.entity';
import { UserType } from 'src/interfaces/user';
import { Category } from 'src/modules/category/entities/category.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { userTypes } from 'src/modules/users/entities/user-type.entity';
import { GymMemberRelation } from 'src/modules/gym-member-relation/entities/gym-member-relation.entity';

@Entity('GymMember')
export class GymMember {
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
  type: UserType;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  expireAt: Date | null;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.gymMembers)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @CreateDateColumn({
    type: 'datetime',
    select: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'datetime' })
  updatedAt: Date;

  @OneToMany(
    () => GymMemberRelation,
    (gymMemberRelation) => gymMemberRelation.gymMembers,
  )
  gymMemberRelations: GymMemberRelation[];
}
