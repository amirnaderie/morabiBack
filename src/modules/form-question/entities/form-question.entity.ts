import { User } from 'src/modules/users/entities/user.entity';
import { Form } from 'src/modules/form/entities/form.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Exclude } from 'class-transformer';
import { FormQuestionAnswer } from 'src/modules/form-question-answer/entities/form-question-answer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FormQuestion')
export class FormQuestion {
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
