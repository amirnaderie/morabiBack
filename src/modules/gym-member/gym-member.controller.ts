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

import { AuthGuard } from 'src/guards/auth.guard';
import { GymMember } from './entities/gym-member.entity';
import { UserTypeService } from './gym-member.service';
import { CreateGymMemberDto } from './dto/create-gym-member.dto';
import { UpdateGymMemberDto } from './dto/update-gym-member.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

@Controller('user-type')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  @SetMetadata('permission', 'create-user-type')
  async create(
    @Body() createUserTypeDto: CreateGymMemberDto,
  ): Promise<GymMember> {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Get()
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserTypeDto: UpdateGymMemberDto,
  ) {
    return this.userTypeService.update(id, updateUserTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTypeService.remove(+id);
  }
}
