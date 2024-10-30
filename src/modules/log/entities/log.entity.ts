import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  correlationId: string;

  @Column({ nullable: true, length: 100 })
  methodName: string;

  @Column({ type: 'ntext', nullable: true })
  request: string;

  @Column({ type: 'ntext', nullable: true })
  logMessage: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
