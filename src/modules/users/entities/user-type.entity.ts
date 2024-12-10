import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user-type')
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 20, enum: ['mentor', 'athlete'] })
  name: 'mentor' | 'athlete';
}

export const userTypes = {
  MENTOR: 'mentor',
  ATHLETE: 'athlete',
};
