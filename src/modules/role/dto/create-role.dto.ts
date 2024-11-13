import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  enName: string;
}

export class AssignPermissionToRole {
  @IsNotEmpty()
  @IsString()
  roleId: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  permissionIds: string[];
}
