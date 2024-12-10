import { PartialType } from '@nestjs/swagger';
import { CreateAthleteMentorDto } from './create-athlete-mentor.dto';

export class UpdateAthleteMentorDto extends PartialType(CreateAthleteMentorDto) {}
