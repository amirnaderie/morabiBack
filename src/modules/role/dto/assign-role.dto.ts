import { IsNotEmpty, IsString } from 'class-validator';

export class AssginRoleDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;
}
