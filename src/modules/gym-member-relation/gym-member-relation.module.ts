import { LogModule } from '../log/log.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { GymMemberRelation } from './entities/gym-member-relation.entity';
import { GymMemberRelationService } from './providers/gym-member-relation.service';
import { GymMemberRelationController } from './controllers/mentor.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([GymMemberRelation]),
    forwardRef(() => AuthModule),
    forwardRef(() => LogModule),
  ],
  controllers: [GymMemberRelationController],
  providers: [GymMemberRelationService],
})
export class GymMemberRelationModule {}
