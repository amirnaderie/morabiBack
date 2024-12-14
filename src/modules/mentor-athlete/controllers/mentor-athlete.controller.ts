import {
  Get,
  Post,
  UseGuards,
  Controller,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';

import { User } from '../../users/entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { MentorAthleteService } from '../providers/mentor-athlete.service';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

@Controller('/mentor')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class MentorAthleteController {
  constructor(private readonly mentorAthleteService: MentorAthleteService) {}

  @Get('/athletes')
  @SetMetadata('permission', 'mentor-read-athletes')
  findAll(@GetUser() user: User) {
    return this.mentorAthleteService.findAllMentorAthletes({ user: user });
  }

  @Post('/assign-athlete')
  @SetMetadata('permission', 'mentor-assign-athlete')
  assignAthlete(@GetUser() user: User) {
    return this.mentorAthleteService.assignAthlete();
  }
}
