import {
  Req,
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

import { User } from '../users/entities/user.entity';
import { Form } from './entities/form.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { FormService } from './providers/form.service';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateFormDto } from './dto/create-form.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

@Controller('form')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  @SetMetadata('permission', 'create-form')
  async create(
    @Req() req: Request,
    @GetUser() user: User,
    @Body() createFormDto: CreateFormDto,
  ): Promise<{ data: Form }> {
    return await this.formService.create(createFormDto, req, user);
  }

  @Get()
  @SetMetadata('permission', 'forms')
  async findAll(@Req() req: Request, @GetUser() user: User): Promise<Form[]> {
    return await this.formService.findAll(req, user);
  }

  @Get(':id')
  @SetMetadata('permission', 'read-form')
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<Form> {
    return this.formService.findOne(id, req, user);
  }

  @Get('/:id/question')
  @SetMetadata('permission', 'form-questions')
  findQuestions(
    @Param('id') id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<Form> {
    return this.formService.findQuestions(id, req, user);
  }

  @Patch(':id')
  @SetMetadata('permission', 'update-form')
  update(
    @Req() req: Request,
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formService.update(id, req, user, updateFormDto);
  }

  @Delete(':id')
  @SetMetadata('permission', 'delete-form')
  remove(
    @Param('id') id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<any> {
    return this.formService.remove(id, req, user);
  }
}
