import { Form } from '../entities/form.entity';
import { Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFormDto } from '../dto/create-form.dto';
import { UpdateFormDto } from '../dto/update-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { LogService } from 'src/modules/log/providers/log.service';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    private readonly logService: LogService,
  ) {}

  async create(
    createFormDto: CreateFormDto,
    req: Request,
    user: User,
  ): Promise<{ data: Form }> {
    try {
      const { name, description } = createFormDto;

      const form = this.formRepository.create({
        name: name,
        description: description,
        creatorId: user.id,
        realmId: (req as any).subdomainId || 1,
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

  async findAll(req: Request, user: User): Promise<Form[]> {
    try {
      return await this.formRepository.find({
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

  async findOne(id: string, req: Request, user: User): Promise<Form> {
    try {
      return await this.formRepository.findOne({
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

  async remove(id: string, req: Request, user: User) {
    return this.formRepository.delete({
      id: id,
      creatorId: user.id,
      realmId: (req as any).subdomainId || 1,
    });
  }
}
