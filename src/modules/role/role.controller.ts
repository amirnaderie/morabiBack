import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AssignPermissionToRole, CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './providers/role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';

@Controller('role')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  getRoles(): Promise<Role[]> {
    return this.rolesService.getRoles();
  }

  @Post()
  createRoles(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Post('assign-permission')
  assignPermissionToRole(
    @Body() assignPermissionToRole: AssignPermissionToRole,
  ): Promise<Role> {
    return this.rolesService.assignPermissionToRole(assignPermissionToRole);
  }

  @Patch('/:id')
  updateRoles(
    @Param('id') id: string,
    @Body() updateRolesDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.updateRoles(id, updateRolesDto);
  }

  @Delete('/:id')
  deleteRoles(@Param('id') id: string): Promise<void> {
    return this.rolesService.deleteRoles(id);
  }
}
