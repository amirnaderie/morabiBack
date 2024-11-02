import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends CreateRoleDto {
  @IsArray()
  @IsString({ each: true })
  @MaxLength(3, {
    each: true,
  })
  @MinLength(1, {
    each: true,
  })
  permissions: string[];
}
