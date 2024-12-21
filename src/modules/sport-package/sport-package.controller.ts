import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateSportPackageDto } from './dto/create-sport-package.dto';
import { UpdateSportPackageDto } from './dto/update-sport-package.dto';
import { SportPackageService } from './providers/sport-package.service';
import { User } from '../users/entities/user.entity';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { RolesGuard } from 'src/guards/role.guard';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('sport-package')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class SportPackageController {
  constructor(private readonly sportPackageService: SportPackageService) {}

  @Post()
  create(@Body() createSportPackageDto: CreateSportPackageDto) {
    return this.sportPackageService.create(createSportPackageDto);
  }

  @Get()
  @SetMetadata('permission', 'packages')
  findAll(@GetUser() user: User) {
    return this.sportPackageService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sportPackageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSportPackageDto: UpdateSportPackageDto,
  ) {
    return this.sportPackageService.update(+id, updateSportPackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportPackageService.remove(+id);
  }
}
