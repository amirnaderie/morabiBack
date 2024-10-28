import { Roles } from 'src/modules/roles/roles.entity';

export class UserResponseDto {
  id: string;
  userName: string;
  roles: Roles[];
}
