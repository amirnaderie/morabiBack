import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { TagService } from './providers/tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('tags')
@UseGuards(AuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto, @GetUser() user: User) {
    return this.tagService.createMany(createTagDto, user);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
