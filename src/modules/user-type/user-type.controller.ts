import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  UseGuards,
  UseInterceptors,
  SetMetadata,
} from '@nestjs/common';

import { UserTypeService } from './user-type.service';
import { CreateUserTypeDto } from './dto/create-user-type.dto';
import { UpdateUserTypeDto } from './dto/update-user-type.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { UserType } from './entities/user-type.entity';

@Controller('user-type')
@UseGuards(AuthGuard)
@UseInterceptors(HttpResponseTransform)
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  @SetMetadata('permission', 'create-user-type')
  async create(
    @Body() createUserTypeDto: CreateUserTypeDto,
  ): Promise<UserType> {
    return this.userTypeService.create(createUserTypeDto);
  }

  @Get()
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return this.userTypeService.update(id, updateUserTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTypeService.remove(+id);
  }
}
