import {
  Get,
  Post,
  UseGuards,
  Controller,
  SetMetadata,
  UseInterceptors,
  Body,
} from '@nestjs/common';

import { User } from '../../users/entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { MentorAthleteService } from '../providers/mentor-athlete.service';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { CreateMentorAthleteDto } from '../dto/create-mentor-athlete.dto';
import { MentorAthlete } from '../entities/mentor-athlete.entity';

@Controller('/mentor-athlete')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class MentorAthleteController {
  constructor(private readonly mentorAthleteService: MentorAthleteService) {}

  @Get('/athletes')
  // @SetMetadata('permission', 'mentor-read-athlet/es')
  findAll(@GetUser() user: User) {
    return this.mentorAthleteService.findAllMentorAthletes({ user: user });
  }

  @Post()
  // @SetMetadata('permission', 'mentor-assign-athlete')
  @SetMetadata('permission', 'create-movement')
  create(
    @Body() createMentorAthleteDto: CreateMentorAthleteDto,
  ): Promise<MentorAthlete> {
    return this.mentorAthleteService.create(createMentorAthleteDto);
  }
}
