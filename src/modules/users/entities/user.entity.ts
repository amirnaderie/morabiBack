import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/modules/role/entities/role.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Plan } from 'src/modules/plan/entities/plan.entity';
import { Profile } from './profile.entity';
import { Athlete } from 'src/modules/athlete/entities/athlete.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';

@Entity()
@Unique(['userMobile', 'realmId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 }) realmId: number;

  @Column({
    nullable: true,
  })
  profileId: string;

  @Column({ length: 100, select: false })
  password: string;

  @Column({ length: 12 })
  userMobile: string;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'user_roles' })
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

  @OneToOne(() => Profile, (profile) => profile.user) // specify inverse side as a second parameter
  @JoinColumn({ name: 'profileId' })
  profile: Profile;
}
