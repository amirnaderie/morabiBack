import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './enum/task-status.enum';

@Entity('Task')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}
