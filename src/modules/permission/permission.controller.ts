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
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './providers/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private PermissionService: PermissionService) {}

  @Get()
  getPermission(@Req() req: Request): Promise<Permission[]> {
    return this.PermissionService.getPermission(req);
  }

  @Post()
  createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
    @Req() req: Request,
  ): Promise<Permission> {
    return this.PermissionService.createPermission(createPermissionDto,req);
  }

  @Patch('/:id')
  updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: CreatePermissionDto,
    @Req() req: Request,
  ): Promise<Permission> {
    return this.PermissionService.updatePermission(id, updatePermissionDto,req);
  }

  @Delete('/:id')
  deletePermission(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    return this.PermissionService.deletePermission(id,req);
  }
}
