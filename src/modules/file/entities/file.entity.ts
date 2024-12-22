import { Plan } from 'src/modules/plan/entities/plan.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { BaseEntity } from 'src/modules/base/base.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('File')
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 }) realmId: number;
  @Column() userId: string;

  @Column({ nullable: false, length: 150 })
  orginalName: string;

  @Column({ nullable: true, length: 100 })
  storedName: string;

  @ManyToMany(() => Movement, (movement) => movement.files, {
    onDelete: 'CASCADE',
  })
  movements: Movement[];

  @ManyToMany(() => Plan, (plan) => plan.logo, {
    onDelete: 'CASCADE',
  })
  plans: Plan[];

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Realm, (realm) => realm.files)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;
}
