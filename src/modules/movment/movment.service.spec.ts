import { Test, TestingModule } from '@nestjs/testing';
import { MovmentService } from './movment.service';

describe('MovmentService', () => {
  let service: MovmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovmentService],
    }).compile();

    service = module.get<MovmentService>(MovmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
