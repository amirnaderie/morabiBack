import { Tag } from 'src/modules/tag/entities/tag.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Exclude } from 'class-transformer';

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

  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @OneToMany(() => File, (file) => file.movement, { eager: true })
  files: File[];

  @ManyToOne(() => User, (user) => user.movements, { eager: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.movements)
  @JoinTable({
    name: 'movement-tag',
  })
  tags: Tag[];
}