import { FormController } from './form-question.controller';
import { FormQuestionService } from './providers/form-question.service';

import { Test, TestingModule } from '@nestjs/testing';

describe('FormController', () => {
  let controller: FormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [FormQuestionService],
    }).compile();

    controller = module.get<FormController>(FormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
