import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateRoleDto } from './create-roles.dto';

export class UpdateRoleDto extends CreateRoleDto {
  @IsArray()
  @IsString({ each: true })
  @MaxLength(36, {
    each: true,
  })
  @MinLength(36, {
    each: true,
  })
  permissions: string[];
}
