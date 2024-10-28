import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
