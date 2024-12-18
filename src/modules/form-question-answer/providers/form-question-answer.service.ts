import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LogService } from 'src/modules/log/providers/log.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { FormQuestionAnswer } from '../entities/form-question-answer.entity';
import { CreateFormQuestionAnswerDto } from '../dto/create-form-question-answer.dto';
import { UpdateFormQuestionAnswerDto } from '../dto/update-form-question-answer.dto';
import { UtilityService } from 'src/utility/providers/utility.service';

@Injectable()
export class FormQuestionAnswerService {
  constructor(
    @InjectRepository(FormQuestionAnswer)
    private readonly formQuestionAnswerRepository: Repository<FormQuestionAnswer>,
    private readonly logService: LogService,
    private readonly utilityService: UtilityService,
  ) {}

  async create(
    createFormQuestionAnswerDto: CreateFormQuestionAnswerDto,
    req: Request,
    user: User,
  ): Promise<FormQuestionAnswer> {
    try {
      const { text, questionId } = createFormQuestionAnswerDto;

      if (!this.utilityService.onlyLettersAndNumbers(text))
        throw new BadRequestException('مقادیر ورودی معتبر نیست');

      const formQuestion = this.formQuestionAnswerRepository.create({
        text: text,
        questionId: questionId,
        creatorId: user.id,
        realmId: (req as any).subdomainId || 1,
      });

      return await this.formQuestionAnswerRepository.save(formQuestion);
    } catch (error) {
      this.logService.logData(
        'create-form',
        JSON.stringify({
          createFormQuestionDto: createFormQuestionAnswerDto,
          user: user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );

      if (error.message.includes('Violation of UNIQUE KEY constraint'))
        throw new ConflictException('اطلاعات فرم تکراری است');

      throw new Error(error);
    }
  }

  async findAll(req: Request, user: User): Promise<FormQuestionAnswer[]> {
    try {
      return await this.formQuestionAnswerRepository.find({
        where: {
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
    } catch (error) {
      this.logService.logData(
        'findAll-form',
        JSON.stringify({ user: user, req: req }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async findOne(
    id: string,
    req: Request,
    user: User,
  ): Promise<FormQuestionAnswer> {
    try {
      return await this.formQuestionAnswerRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
    } catch (error) {
      this.logService.logData(
        'findOne-form',
        JSON.stringify({ user: user, req: req }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async update(
    id: string,
    req: Request,
    user: User,
    updateFormQuestionAnswerDto: UpdateFormQuestionAnswerDto,
  ) {
    try {
      const { text } = updateFormQuestionAnswerDto;
      const form = await this.formQuestionAnswerRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
      form.text = text;

      return await this.formQuestionAnswerRepository.save(form);
    } catch (error) {
      this.logService.logData(
        'update-form',
        JSON.stringify({
          id: id,
          req: req,
          user: user,
          updateFormQuestionDto: updateFormQuestionAnswerDto,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async remove(id: string, req: Request, user: User) {
    return this.formQuestionAnswerRepository.delete({
      id: id,
      creatorId: user.id,
      realmId: (req as any).subdomainId || 1,
    });
  }
}
