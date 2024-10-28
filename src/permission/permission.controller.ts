import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './permission.entity';
import { PermissionService } from './providers/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private PermissionService: PermissionService) {}

  @Get()
  getPermission(): Promise<Permission[]> {
    return this.PermissionService.getPermission();
  }

  @Post()
  createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.PermissionService.createPermission(createPermissionDto);
  }

  @Patch('/:id')
  updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.PermissionService.updatePermission(id, updatePermissionDto);
  }

  @Delete('/:id')
  deletePermission(@Param('id') id: string): Promise<void> {
    return this.PermissionService.deletePermission(id);
  }
}
