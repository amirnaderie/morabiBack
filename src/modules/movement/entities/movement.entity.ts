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

@Entity()
@Unique(['name', 'creatorId'])
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;

  @Column({ type: 'bit', default: false })
  isDefault: boolean;
  @Column({ nullable: true, length: 10 })
  mimetype: string;
  @Column({
    type: 'nvarchar',
    length: 500,
  })
  description: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  screenSeconds: number;

  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @ManyToMany(() => File, (file) => file.movements)
  @JoinTable({
    name: 'file-movement',
  })
  files: File[];

  @ManyToOne(() => User, (user) => user.movements)
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  user: User;

  @Column() creatorId: string; // Add this line to define creatorId as a column

  @ManyToMany(() => Tag, (tag) => tag.movements, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'movement-tag',
  })
  tags: Tag[];
}
