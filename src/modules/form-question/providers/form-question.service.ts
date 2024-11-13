import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LogService } from 'src/modules/log/providers/log.service';
import { FormQuestion } from '../entities/form-question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFormQuestionDto } from '../dto/create-form-question.dto';
import { UpdateFormQuestionDto } from '../dto/update-form-question.dto';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class FormQuestionService {
  constructor(
    @InjectRepository(FormQuestion)
    private readonly formQuestionRepository: Repository<FormQuestion>,
    private readonly logService: LogService,
  ) {}

  async create(
    createFormQuestionDto: CreateFormQuestionDto,
    req: Request,
    user: User,
  ): Promise<FormQuestion> {
    try {
      const { text } = createFormQuestionDto;

      const formQuestion = this.formQuestionRepository.create({
        text: text,
      });

      return await this.formQuestionRepository.save(formQuestion);
    } catch (error) {
      this.logService.logData(
        'create-form',
        JSON.stringify({
          createFormQuestionDto: createFormQuestionDto,
          user: user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );

      if (error.message.includes('Violation of UNIQUE KEY constraint'))
        throw new ConflictException('اطلاعات فرم تکراری است');

      throw new Error(error);
    }
  }

  async findAll(req: Request, user: User): Promise<FormQuestion[]> {
    try {
      return await this.formQuestionRepository.find({
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

  async findOne(id: string, req: Request, user: User): Promise<FormQuestion> {
    try {
      return await this.formQuestionRepository.findOne({
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
    updateFormQuestionDto: UpdateFormQuestionDto,
  ) {
    try {
      const { text } = updateFormQuestionDto;
      const form = await this.formQuestionRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
      form.text = text;

      return await this.formQuestionRepository.save(form);
    } catch (error) {
      this.logService.logData(
        'update-form',
        JSON.stringify({
          id: id,
          req: req,
          user: user,
          updateFormQuestionDto: updateFormQuestionDto,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async remove(id: string, req: Request, user: User) {
    return this.formQuestionRepository.delete({
      id: id,
      creatorId: user.id,
      realmId: (req as any).subdomainId || 1,
    });
  }
}
