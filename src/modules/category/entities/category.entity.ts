import { Athlete } from 'src/modules/athlete/entities/athlete.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  parentId: number;

  @Column({ nullable: true, length: 100, type: 'nvarchar' })
  name: string | null;

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  @JoinColumn({ name: 'parentId' })
  children: Category[];

  @OneToMany(() => Athlete, (athlete) => athlete.category, {
    cascade: true,
  })
  athletes: Athlete[];

  @OneToMany(() => Athlete, (athlete) => athlete.category, {
    cascade: true,
  })
  mentors: Mentor[];
}
