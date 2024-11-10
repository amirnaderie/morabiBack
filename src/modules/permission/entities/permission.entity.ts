import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  enName: string;

  @CreateDateColumn()
  createdA: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedA: Date;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: 'role-permission',
  })
  roles: Role[];

  @ManyToOne(() => Realm, (realm) => realm.permissions)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @Column({ default: 1 }) realmId: number;
}
