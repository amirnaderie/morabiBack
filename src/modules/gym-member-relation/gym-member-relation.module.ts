import { Module } from '@nestjs/common';
import { GymMemberRelationService } from './gym-member-relation.service';
import { GymMemberRelationController } from './gym-member-relation.controller';

@Module({
  controllers: [GymMemberRelationController],
  providers: [GymMemberRelationService],
})
export class GymMemberRelationModule {}
