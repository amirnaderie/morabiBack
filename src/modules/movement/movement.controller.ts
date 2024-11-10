import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  SetMetadata,
  Req,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { Movement } from './entities/movement.entity';
import { AuthGuard } from '../auth/auth.guard';
import { MovementService } from './providers/movement.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { RolesGuard } from 'src/guards/role.guard';
import { GetUser } from 'src/decorators/getUser.decorator';

@Controller('movements')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post()
  @SetMetadata('permission', 'create-movement')
  async create(
    @GetUser() user: User,
    @Body() createMovementDto: CreateMovementDto,
    @Req() req: Request,
  ): Promise<{ data: Movement }> {
    return await this.movementService.create(createMovementDto, user, req);
  }

  @Get()
  @SetMetadata('permission', 'read-movements')
  findAll(@GetUser() user: User, @Req() req: Request) {
    return this.movementService.findAll(user.id, req);
  }

  @Get(':id')
  @SetMetadata('permission', 'movement')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.movementService.findOne(id, req);
  }

  @Patch(':id')
  @SetMetadata('permission', 'update-movement')
  async update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateMovementDto: UpdateMovementDto,
    @Req() req: Request,
  ) {
    return await this.movementService.update(updateMovementDto, id, user, req);
  }

  @Delete(':id')
  @SetMetadata('permission', 'delete-movement')
  remove(@Param('id') id: string, @GetUser() user: User, @Req() req: Request) {
    return this.movementService.remove(id, user, req);
  }
}
