import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  // OneToOne,
  Unique,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from 'src/modules/role/entities/role.entity';
import { Movement } from 'src/modules/movement/entities/movement.entity';
import { File } from 'src/modules/file/entities/file.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Realm } from 'src/modules/realm/entities/realm.entity';
import { Plan } from 'src/modules/plan/entities/plan.entity';
// import { Profile } from './profile.entity';
import { Athlete } from 'src/modules/athlete/entities/athlete.entity';
import { Mentor } from 'src/modules/mentor/entities/mentor.entity';
import { BaseEntity } from 'src/modules/base/base.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';

@Entity('User')
@Unique(['userMobile', 'realmId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 }) realmId: number;

  // @Column({
  //   nullable: true,
  // })
  // profileId: string;

  @Column({ length: 100, select: false })
  password: string;

  @Column({ length: 100, nullable: true })
  family: string;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column({ length: 12 })
  userMobile: string;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'UserRoles' })
  roles: Role[];

  @ManyToMany(() => Role, (role) => role.permissions)
  permissions?: string[];

  @OneToMany(() => Movement, (movement) => movement.user)
  movements: Movement[];

  @OneToMany(() => Plan, (plan) => plan.user)
  plans: Plan[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  @OneToMany(() => Athlete, (athlete) => athlete.user, {
    cascade: true,
  })
  athletes: Athlete[];

  @OneToMany(() => Mentor, (mentor) => mentor.user, {
    cascade: true,
  })
  mentors: Mentor[];

  @ManyToOne(() => Realm, (realm) => realm.users)
  @JoinColumn({ name: 'realmId' })
  realm: Realm;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}


// USE [morabiDb]
// GO
// /****** Object:  StoredProcedure [dbo].[getAthletesOfMentor]    Script Date: 1/1/2025 4:58:42 PM ******/
// SET ANSI_NULLS ON
// GO
// SET QUOTED_IDENTIFIER ON
// GO
// -- =============================================
// -- Author:		<Author,,Name>
// -- Create date: <Create Date,,>
// -- Description:	<Description,,>
// -- =============================================
// create PROCEDURE [dbo].[getAthletesOfMentor] 
// 	@userId uniqueidentifier='990C5626-59C0-EF11-935F-60DD8E0D6339'
// AS
// BEGIN
// 	-- SET NOCOUNT ON added to prevent extra result sets from
// 	-- interfering with SELECT statements.
// 	SET NOCOUNT ON;
	
// select a.id as athleteId,u.[name],u.family,asp.createdAt,asp.createdAt+sp.durationInDays as expirationDate, m.id as mentorId from Mentor m
// inner join SportPackage sp on m.id=sp.mentorId
// inner join AthleteSportPackage asp on asp.mentorId=m.id and asp.sportPackageId=sp.id
// inner join Athlete a on a.id=asp.athleteId
// inner join [User] u on a.userId=u.id
// where m.userId=@userId and asp.createdAt+sp.durationInDays>GETUTCDATE()


// END

