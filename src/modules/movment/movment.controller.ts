import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovmentService } from './movment.service';
import { CreateMovmentDto } from './dto/create-movment.dto';
import { UpdateMovmentDto } from './dto/update-movment.dto';

@Controller('movment')
export class MovmentController {
  constructor(private readonly movmentService: MovmentService) {}

  @Post()
  create(@Body() createMovmentDto: CreateMovmentDto) {
    return this.movmentService.create(createMovmentDto);
  }

  @Get()
  findAll() {
    return this.movmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovmentDto: UpdateMovmentDto) {
    return this.movmentService.update(+id, updateMovmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movmentService.remove(+id);
  }
}
