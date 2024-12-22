import { Exclude } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ select: false, type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ select: false, type: 'datetime' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ select: false, type: 'datetime' })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;
}
