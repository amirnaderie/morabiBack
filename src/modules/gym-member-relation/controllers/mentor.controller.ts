import {
  Get,
  UseGuards,
  Controller,
  SetMetadata,
  UseInterceptors,
  Post,
} from '@nestjs/common';

import { User } from '../../users/entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { GymMemberRelationService } from '../providers/gym-member-relation.service';

@Controller('/mentor')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class GymMemberRelationController {
  constructor(
    private readonly gymMemberRelationService: GymMemberRelationService,
  ) {}

  @Get('/athletes')
  @SetMetadata('permission', 'mentor-read-athletes')
  findAll(@GetUser() user: User) {
    return this.gymMemberRelationService.findAllMentorAthletes({ user: user });
  }

  @Post('/assign-athlete')
  @SetMetadata('permission', 'mentor-assign-athlete')
  assignAthlete(@GetUser() user: User) {
    return this.gymMemberRelationService.assignAthlete();
  }
}
