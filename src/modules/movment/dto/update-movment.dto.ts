import { PartialType } from '@nestjs/swagger';
import { CreateMovmentDto } from './create-movment.dto';

export class UpdateMovmentDto extends PartialType(CreateMovmentDto) {}
