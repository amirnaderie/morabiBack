import { Role } from 'src/modules/role/role.entity';

export class UserResponseDto {
  id: string;
  userName: string;
  roles: Role[];
}