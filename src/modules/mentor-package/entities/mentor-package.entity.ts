import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MentorPackage')
export class MentorPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentId: string;

  @Column({
    type: 'nvarchar',
    length: 150,
  })
  name: string;

  @Column({
    type: 'bit',
  })
  status: boolean;
}
