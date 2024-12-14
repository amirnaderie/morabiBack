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

import { Athlete } from './entities/athlete.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { AthleteService } from './athlete.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

@Controller('athletes')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post()
  create(@Body() createAthleteDto: CreateAthleteDto): Promise<Athlete> {
    return this.athleteService.create(createAthleteDto);
  }

  @Get()
  @SetMetadata('permission', 'read-athletes')
  findAll() {
    return this.athleteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athleteService.findOne(+id);
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
