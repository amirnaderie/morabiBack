import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  Put,
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
  @SetMetadata('permission', 'create-package')
  create(
    @Body() createSportPackageDto: CreateSportPackageDto,
    @GetUser() user: User,
  ) {
    return this.sportPackageService.create(createSportPackageDto, user.id);
  }

  @Get()
  @SetMetadata('permission', 'packages')
  findAll(@GetUser() user: User) {
    return this.sportPackageService.findAll(user.id);
  }

  @Get(':id')
  @SetMetadata('permission', 'package')
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.sportPackageService.findOne(id, user.id);
  }

  @Patch(':id')
  @SetMetadata('permission', 'update-package')
  updateOneCol(
    @Param('id') id: number,
    @Body('addedToSite') addedToSite: boolean,
    @GetUser() user: User,
  ) {
    return this.sportPackageService.updateOneCol(id, addedToSite, user.id);
  }

  @Put(':id')
  @SetMetadata('permission', 'update-package')
  update(
    @Param('id') id: string,
    @Body() updateSportPackageDto: UpdateSportPackageDto,
    @GetUser() user: User,
  ) {
    return this.sportPackageService.update(+id, user.id, updateSportPackageDto);
  }

  @Delete(':id')
  @SetMetadata('permission', 'delete-package')
  remove(@Param('id') id: number, @GetUser() user: User) {
    return this.sportPackageService.remove(+id, user.id);
  }
}
