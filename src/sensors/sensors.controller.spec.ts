import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { Sensor } from './sensors.entity';

describe('SensorsController', () => {
  let controller: SensorsController;
  let service: SensorsService;

  const now = new Date(Date.now());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        SensorsService,
        {
          provide: getRepositoryToken(Sensor),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
    service = module.get<SensorsService>(SensorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('adding a sensor returns the appropriate sensor information', async () => {
    const createSensorDto: CreateSensorDto = { name: 'Sensor 1', type: 'temp' };
    const mockedResponse: Sensor = {
      id: 1,
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(service, 'createSensor').mockResolvedValue(mockedResponse);
    const result = await controller.createSensor(createSensorDto);

    expect(result).toEqual(mockedResponse);
    expect(result.id).toEqual(1);
    expect(result.name).toEqual('Sensor 1');
    expect(result.type).toEqual('temp');
    expect(result.active).toEqual(true);
    expect(result.createdAt).toEqual(now);
    expect(result.updatedAt).toEqual(now);
  });
});
