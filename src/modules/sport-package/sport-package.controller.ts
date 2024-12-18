import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSportPackageDto } from './dto/create-sport-package.dto';
import { UpdateSportPackageDto } from './dto/update-sport-package.dto';
import { SportPackageService } from './providers/sport-package.service';

@Controller('sport-package')
export class SportPackageController {
  constructor(private readonly sportPackageService: SportPackageService) {}

  @Post()
  create(@Body() createSportPackageDto: CreateSportPackageDto) {
    return this.sportPackageService.create(createSportPackageDto);
  }

  @Get()
  findAll() {
    return this.sportPackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportPackageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSportPackageDto: UpdateSportPackageDto) {
    return this.sportPackageService.update(+id, updateSportPackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportPackageService.remove(+id);
  }
}
