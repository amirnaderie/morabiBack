import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  enName: string;
}

export class AssignPermissionToRole {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  @MinLength(36)
  roleId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  permissionIds: string[];
}
