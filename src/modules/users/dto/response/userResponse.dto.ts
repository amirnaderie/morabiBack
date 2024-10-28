import { Role } from "src/modules/users/entities/role.entity";

export class UserResponseDto {
  id: string;
  userName: string;
  roles: Role[];
}
