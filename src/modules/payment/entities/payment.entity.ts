import { SportPackage } from 'src/modules/sport-package/entities/sport-package.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  sportPackageId: number;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => SportPackage, (sportPackage) => sportPackage.payments)
  @JoinColumn({ name: 'sportPackageId' })
  sportPackage: SportPackage;
}
