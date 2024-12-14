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

import { Mentor } from './entities/mentor.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { MentorService } from './mentor.service';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

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

  @Get()
  findAll() {
    return this.mentorService.findAll();
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
