import { User } from 'src/modules/users/entities/user.entity';
import { Form } from 'src/modules/form/entities/form.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { FormQuestionAnswer } from 'src/modules/form-question-answer/entities/form-question-answer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FormQuestion')
export class FormQuestion extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column({ default: 1 })
  realmId: number;

  @Column()
  formId: string;

  @Column()
  text: string;

  @ManyToOne(() => Realm, (realm) => realm.movements)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @ManyToOne(() => Form, (form) => form.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'formId' })
  form: Form;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(
    () => FormQuestionAnswer,
    (formQuestionAnswer) => formQuestionAnswer.question,
  )
  answers: FormQuestionAnswer[];
}
