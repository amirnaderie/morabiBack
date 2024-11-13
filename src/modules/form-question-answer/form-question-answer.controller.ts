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
import { FormQuestionAnswer } from './entities/form-question-answer.entity';
import { HttpResponseTransform } from 'src/interceptors/http-response-transform.interceptor';
import { FormQuestionAnswerService } from './providers/form-question-answer.service';
import { CreateFormQuestionAnswerDto } from './dto/create-form-question-answer.dto';
import { UpdateFormQuestionAnswerDto } from './dto/update-form-question-answer.dto';

@Controller('form-question-answer')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(HttpResponseTransform)
export class FormQuestionAnswerController {
  constructor(
    private readonly formQuestionAnswerService: FormQuestionAnswerService,
  ) {}

  @Post()
  @SetMetadata('permission', 'create-formQuestionAnswer')
  async create(
    @Req() req: Request,
    @GetUser() user: User,
    @Body() createFormQuestionAnswerDto: CreateFormQuestionAnswerDto,
  ): Promise<FormQuestionAnswer> {
    return await this.formQuestionAnswerService.create(
      createFormQuestionAnswerDto,
      req,
      user,
    );
  }

  @Get()
  @SetMetadata('permission', 'form-question-answer')
  async findAll(
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<FormQuestionAnswer[]> {
    return await this.formQuestionAnswerService.findAll(req, user);
  }

  @Get(':id')
  @SetMetadata('permission', 'read-formQuestionAnswer')
  findOne(
    @Param('id') id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<FormQuestionAnswer> {
    return this.formQuestionAnswerService.findOne(id, req, user);
  }

  @Patch(':id')
  @SetMetadata('permission', 'update-formQuestionAnswer')
  update(
    @Req() req: Request,
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateFormQuestionAnswerDto: UpdateFormQuestionAnswerDto,
  ) {
    return this.formQuestionAnswerService.update(
      id,
      req,
      user,
      updateFormQuestionAnswerDto,
    );
  }

  @Delete(':id')
  @SetMetadata('permission', 'delete-formQuestionAnswer')
  remove(
    @Param('id') id: string,
    @Req() req: Request,
    @GetUser() user: User,
  ): Promise<any> {
    return this.formQuestionAnswerService.remove(id, req, user);
  }
}
