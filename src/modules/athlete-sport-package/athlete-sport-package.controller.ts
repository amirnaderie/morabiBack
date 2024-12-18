import { AuthGuard } from 'src/guards/auth.guard';
import { AthleteSportPackage } from './entities/athlete-sport-package.entity';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { AthleteSportPackageService } from './athlete-sport-package.service';

import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { CreateAthleteSportPackageDto } from './dto/create-athlete-sport-package.dto';

@Controller('athlete-packages')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class AthleteSportPackageController {
  constructor(
    private readonly athleteSportPackageService: AthleteSportPackageService,
  ) {}

  @Post('')
  create(
    @Body() createAthleteSportPackageDto: CreateAthleteSportPackageDto,
  ): Promise<AthleteSportPackage> {
    return this.athleteSportPackageService.create(createAthleteSportPackageDto);
  }

  @Get()
  findAll() {
    return this.athleteSportPackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athleteSportPackageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athleteSportPackageService.remove(+id);
  }
}
