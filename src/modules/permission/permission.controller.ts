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
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.PermissionService.updatePermission(id, updatePermissionDto);
  }

  @Delete('/:id')
  deletePermission(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.PermissionService.deletePermission(id);
  }
}
