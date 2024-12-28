import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  // OneToOne,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from 'src/modules/role/entities/role.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Plan } from 'src/modules/plan/entities/plan.entity';
// import { Profile } from './profile.entity';
import { Athlete } from 'src/modules/athlete/entities/athlete.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';

@Entity('User')
@Unique(['userMobile', 'realmId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 }) realmId: number;

  // @Column({
  //   nullable: true,
  // })
  // profileId: string;

  @Column({ length: 100, select: false })
  password: string;

  @Column({ length: 100, nullable: true })
  family: string;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column({ length: 12 })
  userMobile: string;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'UserRoles' })
  roles: Role[];

  @ManyToMany(() => Role, (role) => role.permissions)
  permissions?: string[];

  @OneToMany(() => Movement, (movement) => movement.user)
  movements: Movement[];

  @OneToMany(() => Plan, (plan) => plan.user)
  plans: Plan[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  @OneToMany(() => Athlete, (athlete) => athlete.user, {
    cascade: true,
  })
  athletes: Athlete[];

  @OneToMany(() => Mentor, (mentor) => mentor.user, {
    cascade: true,
  })
  mentors: Mentor[];

  @ManyToOne(() => Realm, (realm) => realm.users)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
