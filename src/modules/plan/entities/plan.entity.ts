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

  @Column({ type: 'bit', default: false })
  isDefault: boolean;

  @Column({
    type: 'nvarchar',
    length: 500,
  })
  planDescription: string;


  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

//   @ManyToMany(() => File, (file) => file.movements, { onDelete: 'CASCADE' })
//   @JoinTable({
//     name: 'file-movement',
//   })
//   files: File[];

//   @ManyToOne(() => User, (user) => user.movements)
//   @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
//   user: User;

  @Column() creatorId: string; // Add this line to define creatorId as a column

//   @ManyToMany(() => Tag, (tag) => tag.plans, { onDelete: 'CASCADE' })
//   @JoinTable({
//     name: 'plan-tag',
//   })
//   tags: Tag[];

//   @ManyToOne(() => Realm, (realm) => realm.movements)
//   @JoinColumn({ name: 'realmId' })
//   realm: Realm;

  @Column({ default: 1 })
  realmId: number;
}