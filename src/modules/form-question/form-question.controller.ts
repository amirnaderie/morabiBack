import {
  Get,
  Req,
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
import { GetUser } from 'src/decorators/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { FormQuestion } from './entities/form-question.entity';
import { CreateFormQuestionDto } from './dto/create-form-question.dto';
import { UpdateFormQuestionDto } from './dto/update-form-question.dto';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { FormQuestionService } from './providers/form-question.service';

@Controller('form')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class FormController {
  constructor(private readonly formQuestionService: FormQuestionService) {}

  @Post()
  @SetMetadata('permission', 'create-form')
  async create(
    @Req() req: Request,
    @GetUser() user: User,
    @Body() createFormQuestionDto: CreateFormQuestionDto,
  ): Promise<FormQuestion> {
    return await this.formQuestionService.create(
      createFormQuestionDto,
      req,
      user,
    );
  }

  @Get()
  @SetMetadata('permission', 'forms')
  async findAll(
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<FormQuestion[]> {
    return await this.formQuestionService.findAll(req, user);
  }

  @Get(':id')
  @SetMetadata('permission', 'read-form')
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<FormQuestion> {
    return this.formQuestionService.findOne(id, req, user);
  }

  @Patch(':id')
  @SetMetadata('permission', 'update-form')
  update(
    @Req() req: Request,
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateFormQuestionDto: UpdateFormQuestionDto,
  ) {
    return this.formQuestionService.update(
      id,
      req,
      user,
      updateFormQuestionDto,
    );
  }

  @Delete(':id')
  @SetMetadata('permission', 'delete-form')
  remove(
    @Param('id') id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<any> {
    return this.formQuestionService.remove(id, req, user);
  }
}
