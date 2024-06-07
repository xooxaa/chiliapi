import { Test, TestingModule } from '@nestjs/testing';
import { SensorDataController } from './sensordata.controller';
import { SensorsService } from '../sensors/sensors.service';
import { SensorDataService } from './sensordata.service';
import { Sensor } from '../sensors/sensors.entity';
import { SensorData } from './sensordata.entity';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';

describe('SensordataController', () => {
  let sensorDataController: SensorDataController;
  let sensorsService: SensorsService;
  let sensorDataService: SensorDataService;

  const now = new Date(Date.now());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorDataController],
      providers: [
        SensorDataService,
        {
          provide: SensorsService,
          useValue: {
            findSensorById: jest.fn(),
          },
        },
        {
          provide: SensorDataService,
          useValue: {
            createSensorData: jest.fn(),
          },
        },
      ],
    }).compile();

    sensorDataController =
      module.get<SensorDataController>(SensorDataController);
    sensorsService = module.get<SensorsService>(SensorsService);
    sensorDataService = module.get<SensorDataService>(SensorDataService);
  });

  it('should be defined', () => {
    expect(sensorDataController).toBeDefined();
  });

  it('should add data to a sensor', async () => {
    const createSensorDataDto: CreateSensorDataDto = {
      value: 2,
      rawValue: 355.23,
    };
    const mockedResponse: SensorData = {
      value: 231,
      createdAt: now,
    } as SensorData;
    const sensor: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(sensorsService, 'findSensorById').mockResolvedValue(sensor);
    jest
      .spyOn(sensorDataService, 'createSensorData')
      .mockResolvedValue(mockedResponse);
    const result = await sensorDataController.addSensorData(
      'aaa',
      createSensorDataDto,
    );

    expect(sensorDataService.createSensorData).toHaveBeenCalledWith(
      sensor,
      createSensorDataDto,
    );
    expect(result).toEqual(mockedResponse);
  });
});
