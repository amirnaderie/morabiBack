import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AssginRoleDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  roleId: string;
}
