import {
  Body,
  Patch,
  UseGuards,
  Controller,
  SetMetadata,
  Get,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileService } from './providers/profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  @SetMetadata('permission', 'update-profile')
  update(@Body() updateProfileDto: UpdateProfileDto, @GetUser() user: User) {
    return this.profileService.update(updateProfileDto, user);
  }

  @Get()
  @SetMetadata('permission', 'get-profile')
  get(@GetUser() user: User) {
    return this.profileService.get(user);
  }
}