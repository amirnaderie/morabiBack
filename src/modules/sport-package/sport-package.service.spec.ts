import { Test, TestingModule } from '@nestjs/testing';
import { SportPackageService } from './sport-package.service';

describe('SportPackageService', () => {
  let service: SportPackageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SportPackageService],
    }).compile();

    service = module.get<SportPackageService>(SportPackageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
