import { AthleteSportPackage } from 'src/modules/athlete-sport-package/entities/athlete-sport-package.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SportPackage')
export class SportPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mentor, (mentor) => mentor.sportPackages, {
    onDelete: 'CASCADE',
  })
  mentor: Mentor;

  @OneToMany(
    () => AthleteSportPackage,
    (athleteSportPackage) => athleteSportPackage.sportPackage,
  )
  athleteSportPackages: AthleteSportPackage[];
}
