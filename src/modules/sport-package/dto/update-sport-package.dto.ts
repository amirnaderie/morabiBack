import { PartialType } from '@nestjs/swagger';
import { CreateSportPackageDto } from './create-sport-package.dto';

export class UpdateSportPackageDto extends PartialType(CreateSportPackageDto) {}
