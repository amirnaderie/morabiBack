import { PartialType } from '@nestjs/swagger';
import { CreateGymMemberDto } from './create-gym-member.dto';

export class UpdateGymMemberDto extends PartialType(CreateGymMemberDto) {}
