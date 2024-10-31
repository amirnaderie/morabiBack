import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AssignPermissionToRole, CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './providers/role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolesDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.updateRoles(id, updateRolesDto);
  }

  @Delete('/:id')
  deleteRoles(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.rolesService.deleteRoles(id);
  }
}
