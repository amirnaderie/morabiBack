import { PartialType } from '@nestjs/swagger';
import { CreateGymMemberRelationDto } from './create-gym-member-relation.dto';

export class UpdateGymMemberRelationDto extends PartialType(CreateGymMemberRelationDto) {}
