import { User } from 'src/modules/users/entities/user.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Exclude } from 'class-transformer';
import { FormQuestion } from 'src/modules/form-question/entities/form-question.entity';

import {
  Column,
  Entity,
  Unique,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('form')
@Unique(['name', 'creatorId'])
export class Form {
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
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  description: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Realm, (realm) => realm.movements)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @OneToMany(() => FormQuestion, (formQuestion) => formQuestion.form, {
    onDelete: 'CASCADE',
  })
  questions: FormQuestion[];
}
