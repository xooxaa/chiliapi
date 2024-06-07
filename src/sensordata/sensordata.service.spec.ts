import { Test, TestingModule } from '@nestjs/testing';
import { SensordataService } from './sensordata.service';

describe('SensordataService', () => {
  let service: SensordataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensordataService],
    }).compile();

    service = module.get<SensordataService>(SensordataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
