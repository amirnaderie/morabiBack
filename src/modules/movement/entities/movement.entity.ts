import { Tag } from 'src/modules/tag/entities/tag.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';

import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;

  @Column({ type: 'tinyint', default: 0 })
  isDefault: number;

  @Column({
    type: 'nvarchar',
    length: 500,
  })
  description: string;

  @CreateDateColumn()
  createdA: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @OneToMany(() => File, (file) => file.movement, { eager: true })
  files: File[];

  // @ManyToMany(() => File, (file) => file.movements)
  // @JoinTable({
  //   name: 'file-tag',
  // })
  // files: File[];

  @ManyToOne(() => User, (user) => user.movements, { eager: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.movements)
  @JoinTable({
    name: 'movement-tag',
  })
  tags: Tag[];
}
