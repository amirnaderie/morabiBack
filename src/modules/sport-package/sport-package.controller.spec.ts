import { Test, TestingModule } from '@nestjs/testing';
import { SportPackageController } from './sport-package.controller';
import { SportPackageService } from './sport-package.service';

describe('SportPackageController', () => {
  let controller: SportPackageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportPackageController],
      providers: [SportPackageService],
    }).compile();

    controller = module.get<SportPackageController>(SportPackageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
