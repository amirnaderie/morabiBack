import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AssignPermissionToRole, CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './providers/role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Controller('role')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  getRoles(@Req() req: Request): Promise<Role[]> {
    return this.rolesService.getRoles(req);
  }

  @Post()
  createRoles(
    @Body() createRoleDto: CreateRoleDto,
    @Req() req: Request,
  ): Promise<Role> {
    return this.rolesService.createRole(createRoleDto, req);
  }

  @Post('assign-permission')
  assignPermissionToRole(
    @Body() assignPermissionToRole: AssignPermissionToRole,
    @Req() req: Request,
  ): Promise<Role> {
    return this.rolesService.assignPermissionToRole(
      assignPermissionToRole,
      req,
    );
  }

  @Patch('/:id')
  updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRolesDto: UpdateRoleDto,
    @Req() req: Request,
  ): Promise<Role> {
    return this.rolesService.updateRoles(id, updateRolesDto, req);
  }

  @Delete('/:id')
  deleteRoles(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    return this.rolesService.deleteRoles(id, req);
  }
}
