import { Role } from 'src/modules/role/entities/role.entity';

export class UserResponseDto {
  id: string;
  realmId: number;
  // userName: string;
  roles: Role[];
}
