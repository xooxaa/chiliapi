import { Test, TestingModule } from '@nestjs/testing';
import { SensordataController } from './sensordata.controller';

describe('SensordataController', () => {
  let controller: SensordataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensordataController],
    }).compile();

    controller = module.get<SensordataController>(SensordataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
