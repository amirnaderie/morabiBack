import { User } from 'src/modules/users/entities/user.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { BaseEntity } from 'src/modules/base/base.entity';

import {
  Column,
  Entity,
  Unique,
  JoinTable,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Movement')
@Unique(['name', 'creatorId'])
export class Movement extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;

  @Column({ type: 'bit', default: false })
  isDefault: boolean;

  @Column({
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  screenSeconds: number;

  @ManyToMany(() => File, (file) => file.movements, { cascade: true })
  @JoinTable({
    name: 'FileMovement',
  })
  files: File[];

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @Column() creatorId: string; // Add this line to define creatorId as a column

  @ManyToMany(() => Tag, (tag) => tag.movements, { cascade: true })
  @JoinTable({
    name: 'MovementTag',
  })
  tags: Tag[];

  @ManyToOne(() => Realm, (realm) => realm.movements)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @Column({ default: 1 })
  realmId: number;
}
