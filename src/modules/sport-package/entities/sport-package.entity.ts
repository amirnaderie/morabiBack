import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SportPackage')
export class SportPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mentor, (mentor) => mentor.sportPackages, {
    onDelete: 'CASCADE',
  })
  mentor: Mentor;
}
