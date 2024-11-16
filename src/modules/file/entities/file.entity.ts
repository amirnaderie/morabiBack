import { User } from 'src/modules/users/entities/user.entity';
import { Exclude } from 'class-transformer';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinTable,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Realm } from 'src/modules/realm/entities/realm.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 }) realmId: number;

  @Column({ nullable: false, length: 100 })
  fileName: string;

  @Column({ nullable: true, length: 100 })
  storedName: string;

  @Column({ nullable: true, length: 150 })
  link: string;

  @Column({ nullable: true, length: 10 })
  mimetype: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  @Exclude({ toPlainOnly: true })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @ManyToMany(() => Movement, (movement) => movement.files)
  @JoinTable({
    name: 'file-movement',
  })
  movements: Movement[];

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Realm, (realm) => realm.files)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;
}
