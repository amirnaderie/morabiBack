import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AthleteMentorService } from './athlete-mentor.service';
import { CreateAthleteMentorDto } from './dto/create-athlete-mentor.dto';
import { UpdateAthleteMentorDto } from './dto/update-athlete-mentor.dto';

@Controller('athlete-mentor')
export class AthleteMentorController {
  constructor(private readonly athleteMentorService: AthleteMentorService) {}

  @Post()
  create(@Body() createAthleteMentorDto: CreateAthleteMentorDto) {
    return this.athleteMentorService.create(createAthleteMentorDto);
  }

  @Get()
  findAll() {
    return this.athleteMentorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athleteMentorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAthleteMentorDto: UpdateAthleteMentorDto,
  ) {
    return this.athleteMentorService.update(+id, updateAthleteMentorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athleteMentorService.remove(+id);
  }
}
