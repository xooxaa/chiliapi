import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';

describe('SensorsController', () => {
  let controller: SensorsController;
  let fakeSensorsService: Partial<SensorsService>;

  beforeEach(async () => {
    fakeSensorsService = {
      // createSensor: () => {
      //   return Promise.resolve({
      //     id: 1,
      //   });
      // },
      // findById: (id: number) => {
      //   return Promise.resolve({
      //     id,
      //   });
      // },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        {
          provide: SensorsService,
          useValue: fakeSensorsService,
        },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
});
