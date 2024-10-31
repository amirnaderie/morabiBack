import { Role } from "src/modules/role/entities/role.entity";

export class UserResponseDto {
  id: string;
  userName: string;
  roles: Role[];
}
