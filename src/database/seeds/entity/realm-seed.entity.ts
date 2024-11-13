import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('realm')
export class RealmSeed {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;

  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;
}
