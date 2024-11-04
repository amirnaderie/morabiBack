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
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { Movement } from './entities/movement.entity';
import { AuthGuard } from '../auth/auth.guard';
import { MovementService } from './providers/movement.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

@Controller('movements')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Post()
  async create(
    @GetUser() user: User,
    @Body() createMovementDto: CreateMovementDto,
  ): Promise<{ data: Movement }> {
    return await this.movementService.create(createMovementDto, user);
  }

  @Get()
  findAll() {
    return this.movementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovementDto: UpdateMovementDto,
  ) {
    return await this.movementService.update(updateMovementDto, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementService.remove(id);
  }
}
