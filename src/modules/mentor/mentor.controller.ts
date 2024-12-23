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
import { Mentor } from './entities/mentor.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
// import { AssignAthletesDto } from './dto/assign-athlete.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { MentorService } from './providers/mentor.service';

@Controller('mentors')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Post()
  @SetMetadata('permission', 'create-mentor')
  async create(@Body() createMentorDto: CreateMentorDto): Promise<Mentor> {
    return this.mentorService.create(createMentorDto);
  }

  // @Post('assign-athletes')
  // @SetMetadata('permission', 'create-mentor')
  // async assignAthletes(
  //   @GetUser() user: User,
  //   @Body() assignAthletesDto: AssignAthletesDto,
  // ): Promise<Mentor> {
  //   return this.mentorService.assignAthletes(assignAthletesDto, user);
  // }

  @Get('/mentors')
  getAthletes(@GetUser() user: User) {
    return this.mentorService.getAthletes(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMentorDto: UpdateMentorDto) {
    return this.mentorService.update(id, updateMentorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorService.remove(+id);
  }
}
