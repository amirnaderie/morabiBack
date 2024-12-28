import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { Athlete } from 'src/modules/athlete/entities/athlete.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
// import { SportPackage } from 'src/modules/sport-package/entities/sport-package.entity';

import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Category')
export class Category extends BaseEntity {
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

  // @OneToMany(() => SportPackage, (sportPackage) => sportPackage.category, {
  //   cascade: true,
  // })
  // sportPackages: SportPackage[];
}
