import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Exclude } from 'class-transformer';
import { FormQuestion } from 'src/modules/form-question/entities/form-question.entity';

import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('form-question-answer')
export class FormQuestionAnswer {
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

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

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
