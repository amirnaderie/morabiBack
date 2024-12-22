import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Log')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'int', nullable: true })
  realmId: number;

  @Column({ type: 'uuid', nullable: true })
  correlationId: string;

  @Column({ nullable: true, length: 100 })
  methodName: string;

  @Column({ type: 'ntext', nullable: true })
  request: string;

  @Column({ type: 'ntext', nullable: true })
  logMessage: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  requestIp: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
