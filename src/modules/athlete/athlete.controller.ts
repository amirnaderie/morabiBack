import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Athlete } from './entities/athlete.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { AthleteService } from './providers/athlete.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { AssignPlanDto } from './dto/assign-plan.dto';

@Controller('athletes')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post()
  create(@Body() createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    return this.athleteService.create(createAthleteDto);
  }

  @Post()
  @SetMetadata('permission', 'update-athletes')
  assignPlan(@Body() assignPlanDto: AssignPlanDto): Promise<void> {
    return this.athleteService.assignPlan(assignPlanDto);
  }

  @Get()
  @SetMetadata('permission', 'read-athletes')
  findAll() {
    return this.athleteService.findAll();
  }

  @Get('/actives')
  @SetMetadata('permission', 'read-athletes')
  findActiveAthletes(@GetUser() user: User) {
    return this.athleteService.findActiveAthletes(user.id);
  }

  @Get(':id')
  @SetMetadata('permission', 'read-athlete')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.athleteService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAthleteDto: UpdateAthleteDto) {
    return this.athleteService.update(+id, updateAthleteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athleteService.remove(+id);
  }
}
