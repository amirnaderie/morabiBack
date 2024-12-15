import { PartialType } from '@nestjs/swagger';
import { CreateMentorPackageDto } from './create-mentor-package.dto';

export class UpdateMentorPackageDto extends PartialType(CreateMentorPackageDto) {}
