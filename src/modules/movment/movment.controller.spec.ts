import { Test, TestingModule } from '@nestjs/testing';
import { MovmentController } from './movment.controller';
import { MovmentService } from './movment.service';

describe('MovmentController', () => {
  let controller: MovmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovmentController],
      providers: [MovmentService],
    }).compile();

    controller = module.get<MovmentController>(MovmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
