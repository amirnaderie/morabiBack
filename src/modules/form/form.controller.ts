import {
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  SetMetadata,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { Form } from './entities/form.entity';
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { FormService } from './providers/form.service';
import { QueryFormDto } from './dto/query-params.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { CreateFormDto } from './dto/create-form.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';

@Controller('form')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post(':id/copy')
  @SetMetadata('permission', 'create-form')
  async copy(
    @GetUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Form> {
    return await this.formService.copy(user, id);
  }

  @Post(':id/publish')
  @SetMetadata('permission', 'update-form')
  async publish(
    @GetUser() user: User,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Form> {
    return await this.formService.publish(user, id, req);
  }

  @Post(':id/change-status')
  @SetMetadata('permission', 'update-form')
  async changeStatus(
    @GetUser() user: User,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Form> {
    return await this.formService.changeStatus(user, id, req);
  }

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
  async findAll(
    @Req() req: Request,
    @GetUser() user: User,
    @Query() queryParametrs?: QueryFormDto,
  ): Promise<Form[]> {
    return await this.formService.findAll(req, user, queryParametrs);
  }

  @Get(':id')
  @SetMetadata('permission', 'read-form')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<Form> {
    return this.formService.findOne(id, req, user);
  }

  @Get('/:id/question')
  @SetMetadata('permission', 'form-questions')
  findQuestions(
    @Param('id', new ParseUUIDPipe()) id: string,
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    return this.formService.update(id, req, user, updateFormDto);
  }

  @Delete(':id')
  @SetMetadata('permission', 'delete-form')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<any> {
    return this.formService.remove(id, req, user);
  }
}
