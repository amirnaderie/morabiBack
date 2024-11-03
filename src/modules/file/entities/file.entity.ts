import { Exclude } from 'class-transformer';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 100 })
  fileName: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude({ toPlainOnly: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @ManyToOne(() => Movement, (movement) => movement.files, { eager: false })
  @JoinColumn({ name: 'movementId', referencedColumnName: 'id' })
  movement: Movement;

  @ManyToOne(() => User, (user) => user.files, { eager: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
