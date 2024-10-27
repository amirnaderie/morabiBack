import { Body, Controller, Post } from '@nestjs/common';
// import { GetUser } from 'src/auth/get-user.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
// import { User } from 'src/users/entities/user.entity';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  createTask(
    @Body() createRoleDto: CreateRoleDto,
    // @GetUser() user: User,
  ): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }
}
