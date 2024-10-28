import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-roles.dto';
import { Roles } from './roles.entity';
import { RolesService } from './providers/roles.service';
import { UpdateRoleDto } from './dto/update-roles.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  getRoles(): Promise<Roles[]> {
    return this.rolesService.getRoles();
  }

  @Post()
  createRoles(@Body() createRoleDto: CreateRoleDto): Promise<Roles> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Patch('/:id')
  updateRoles(
    @Param('id') id: string,
    @Body() updateRolesDto: UpdateRoleDto,
  ): Promise<Roles> {
    return this.rolesService.updateRoles(id, updateRolesDto);
  }

  @Delete('/:id')
  deleteRoles(@Param('id') id: string): Promise<void> {
    return this.rolesService.deleteRoles(id);
  }
}
