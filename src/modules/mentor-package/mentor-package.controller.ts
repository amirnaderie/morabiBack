import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';

import { MentorPackageService } from './mentor-package.service';
import { CreateMentorPackageDto } from './dto/create-mentor-package.dto';
import { UpdateMentorPackageDto } from './dto/update-mentor-package.dto';

@Controller('mentor-package')
export class MentorPackageController {
  constructor(private readonly mentorPackageService: MentorPackageService) {}

  @Post()
  create(@Body() createMentorPackageDto: CreateMentorPackageDto) {
    return this.mentorPackageService.create(createMentorPackageDto);
  }

  @Get()
  findAll() {
    return this.mentorPackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mentorPackageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMentorPackageDto: UpdateMentorPackageDto,
  ) {
    return this.mentorPackageService.update(+id, updateMentorPackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorPackageService.remove(+id);
  }
}
