import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class AssginUserRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  @MinLength(36)
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}
