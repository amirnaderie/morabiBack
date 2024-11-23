import { Tag } from 'src/modules/tag/entities/tag.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Exclude } from 'class-transformer';

import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { Realm } from 'src/modules/realm/entities/realm.entity';

@Entity()
@Unique(['planName', 'creatorId'])
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  planName: string;

  @Column({
    type: 'nvarchar',
    length: 500,
  })
  planDescription: string;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  gender: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  weight: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  place: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  level: number;

  @Column({
    type: 'tinyint',
    nullable: true,
  })
  planTime: number;

  @Column({
    type: 'tinyint',
    default: 0,
  })
  state: number;

  @Column({
    type: 'nvarchar',
    length: 'MAX',
    nullable: true,
  })
  weekDays: string;

  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @ManyToOne(() => File, (file) => file.plans, { cascade: true })
  @JoinColumn({ name: 'logoId', referencedColumnName: 'id' })
  logo: File;

  @ManyToOne(() => User, (user) => user.plans)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @Column() creatorId: string; // Add this line to define creatorId as a column

  @ManyToMany(() => Tag, (tag) => tag.plans, { cascade: true })
  @JoinTable({
    name: 'plan-tag',
  })
  tags: Tag[];

  @ManyToOne(() => Realm, (realm) => realm.plans, { cascade: true })
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @Column({ default: 1 })
  realmId: number;
}
