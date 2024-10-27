import { Role } from "src/users/entities/role.entity";

export class UserResponseDto {
  id: string;
  userName: string;
  roles: Role[];
}
