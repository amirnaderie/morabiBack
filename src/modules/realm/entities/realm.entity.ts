import { Form } from 'src/modules/form/entities/form.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Exclude } from 'class-transformer';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { FormQuestion } from 'src/modules/form-question/entities/form-question.entity';

import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from 'src/modules/file/entities/file.entity';

@Entity()
export class Realm {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;

  @OneToMany(() => User, (user) => user.realm)
  users: User[];

  @OneToMany(() => Form, (form) => form.realm, { onDelete: 'CASCADE' })
  forms: Form[];

  @OneToMany(() => FormQuestion, (formQuestion) => formQuestion.realm, {
    onDelete: 'CASCADE',
  })
  formQuestions: FormQuestion[];

  @OneToMany(() => Role, (role) => role.realm, { onDelete: 'CASCADE' })
  roles: Role[];

  @OneToMany(() => Movement, (movement) => movement.realm, {
    onDelete: 'CASCADE',
  })
  movements: Movement[];

  @OneToMany(() => File, (file) => file.realm, {
    onDelete: 'CASCADE',
  })
  files: File[];

  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;
}
