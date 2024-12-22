import { User } from 'src/modules/users/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Plan } from 'src/modules/plan/entities/plan.entity';

@Entity('File')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 }) realmId: number;
  @Column() userId: string;

  @Column({ nullable: false, length: 150 })
  orginalName: string;

  @Column({ nullable: true, length: 100 })
  storedName: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude({ toPlainOnly: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

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
