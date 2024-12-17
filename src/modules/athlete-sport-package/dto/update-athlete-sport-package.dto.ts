import { PartialType } from '@nestjs/swagger';
import { CreateAthleteSportPackageDto } from './create-athlete-sport-package.dto';

export class UpdateAthleteSportPackageDto extends PartialType(CreateAthleteSportPackageDto) {}
