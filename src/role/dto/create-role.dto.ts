import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  enTitle: string;
}
