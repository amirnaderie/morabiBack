import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { FormQuestion } from 'src/modules/form-question/entities/form-question.entity';

import {
  Column,
  Entity,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/modules/base/base.entity';

@Entity('Form')
@Unique(['name'])
export class Form extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column({ default: 1 })
  realmId: number;

  @Column({
    type: 'nvarchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'bit',
    default: 0,
  })
  status: number;

  @Column({
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    length: 10,
    nullable: true,
    type: 'varchar',
  })
  type: string;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Realm, (realm) => realm.movements)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @OneToMany(() => FormQuestion, (formQuestion) => formQuestion.form, {
    cascade: true,
  })
  questions: FormQuestion[];
}
