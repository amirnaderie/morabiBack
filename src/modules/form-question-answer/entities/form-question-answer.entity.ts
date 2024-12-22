import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { FormQuestion } from 'src/modules/form-question/entities/form-question.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FormQuestionAnswer')
export class FormQuestionAnswer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  questionId: string;

  @Column({ default: 1 })
  realmId: number;

  @Column()
  text: string;

  @ManyToOne(() => Realm, (realm) => realm.movements)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @ManyToOne(() => FormQuestion, (formQuestion) => formQuestion.answers)
  @JoinColumn({ name: 'questionId', referencedColumnName: 'id' })
  question: FormQuestion;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;
}
