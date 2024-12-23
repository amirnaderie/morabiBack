import { Form } from '../entities/form.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LogService } from 'src/modules/log/providers/log.service';
import { QueryFormDto } from '../dto/query-params.dto';
import { CreateFormDto } from '../dto/create-form.dto';
import { UpdateFormDto } from '../dto/update-form.dto';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    private readonly logService: LogService,
  ) {}

  async copy(user: User, id: string): Promise<Form> {
    try {
      const oldForm = await this.formRepository.findOne({
        where: { id: id },
        relations: ['questions'],
      });
      if (!oldForm) throw new NotFoundException();

      const form = this.formRepository.create({
        type: oldForm.type,
        name: `${oldForm.name} کپی`,
        creatorId: user.id,
        realmId: oldForm.realmId,
        questions: oldForm.questions,
        description: oldForm.description,
      });

      return await this.formRepository.save(form);
    } catch (error) {
      console.log(error, 'error');
      this.logService.logData(
        'copy-form',
        JSON.stringify({ id: id, user: user }),
        error?.stack ? error.stack : 'error not have message!!',
      );

      if (error.message.includes('Violation of UNIQUE KEY constraint'))
        throw new ConflictException('اطلاعات فرم تکراری است');

      throw new Error(error);
    }
  }

  async create(
    createFormDto: CreateFormDto,
    req: Request,
    user: User,
  ): Promise<{ data: Form }> {
    try {
      const { name, description, type } = createFormDto;

      const form = this.formRepository.create({
        name: name,
        description: description,
        creatorId: user.id,
        realmId: (req as any).subdomainId || 1,
        type: type,
      });

      const formSaved = await this.formRepository.save(form);
      return {
        data: formSaved,
      };
    } catch (error) {
      this.logService.logData(
        'create-form',
        JSON.stringify({ createFormDto: createFormDto, user: user }),
        error?.stack ? error.stack : 'error not have message!!',
      );

      if (error.message.includes('Violation of UNIQUE KEY constraint'))
        throw new ConflictException('اطلاعات فرم تکراری است');

      throw new Error(error);
    }
  }

  async findAll(
    req: Request,
    user: User,
    queryParametrs?: QueryFormDto,
  ): Promise<Form[]> {
    try {
      return await this.formRepository.find({
        where: {
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
          type: queryParametrs.type,
        },
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          createdAt: true,
          description: true,
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

  async findOne(id: string, req: Request, user: User): Promise<Form> {
    try {
      const form = await this.formRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
      if (!form) throw new NotFoundException('یافت نشد');
      return form;
    } catch (error) {
      this.logService.logData(
        'findOne-form',
        JSON.stringify({ user: user, req: req }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async findQuestions(id: string, req: Request, user: User): Promise<Form> {
    try {
      return await this.formRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
        relations: {
          questions: true,
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
  //publish
  async update(
    id: string,
    req: Request,
    user: User,
    updateFormDto: UpdateFormDto,
  ) {
    try {
      const { name, description } = updateFormDto;
      const form = await this.formRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
      form.name = name;
      form.description = description;

      return await this.formRepository.save(form);
    } catch (error) {
      this.logService.logData(
        'update-form',
        JSON.stringify({
          id: id,
          req: req,
          user: user,
          updateFormDto: updateFormDto,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async publish(user: User, id: string, req: Request) {
    try {
      const form = await this.formRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
      form.status = 1;

      return await this.formRepository.save(form);
    } catch (error) {
      this.logService.logData(
        'publish-form',
        JSON.stringify({
          id: id,
          req: req,
          user: user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async changeStatus(user: User, id: string, req: Request) {
    try {
      const form = await this.formRepository.findOne({
        where: {
          id: id,
          creatorId: user.id,
          realmId: (req as any).subdomainId || 1,
        },
      });
      form.status = Number(!form.status);

      return await this.formRepository.save(form);
    } catch (error) {
      this.logService.logData(
        'changeStatus-form',
        JSON.stringify({
          id: id,
          req: req,
          user: user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }

  async remove(id: string, req: Request, user: User) {
    try {
      return this.formRepository.delete({
        id: id,
        creatorId: user.id,
        realmId: (req as any).subdomainId || 1,
      });
    } catch (error) {
      this.logService.logData(
        'remove-form',
        JSON.stringify({
          id: id,
          req: req,
          user: user,
        }),
        error?.stack ? error.stack : 'error not have message!!',
      );
      throw new Error(error);
    }
  }
}
