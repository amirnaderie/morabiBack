import { User } from 'src/modules/users/entities/user.entity';
import { Exclude } from 'class-transformer';

import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Role } from 'src/modules/role/entities/role.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';

@Entity()
export class Realm {
  @PrimaryGeneratedColumn() id: number;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;

  @OneToMany(() => User, (user) => user.realm)
  users: User[];

  @OneToMany(() => Role, (role) => role.realm)
  roles: Role[];

  @OneToMany(() => Movement, (movement) => movement.realm)
  movements: Movement[];

  @CreateDateColumn({ select: false })
  createdA: Date;

  @UpdateDateColumn({ select: false })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;
}
