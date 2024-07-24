import { Test, TestingModule } from '@nestjs/testing';
import { SensorDataController } from './sensordata.controller';
import { SensorsService } from '../sensors/sensors.service';
import { SensorDataService } from './sensordata.service';
import { Sensor } from '../sensors/sensors.entity';
import { SensorData } from './sensordata.entity';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';
import { GetSensorDataByIntervalDto } from './dtos/get-sensor-data-by.dto';
import { User } from '../users/users.entity';

describe('SensordataController', () => {
  let sensorDataController: SensorDataController;
  let sensorDataService: SensorDataService;

  const now = new Date(Date.now());
  const mockedUser = {
    id: 'lll',
    name: 'User One',
    email: 'one@some.user',
  } as User;
  const mockedSensor: Sensor = {
    id: 'aaa',
    name: 'Sensor 1',
    type: 'temperature',
    active: true,
  } as Sensor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorDataController],
      providers: [
        SensorDataService,
        {
          provide: SensorsService,
          useValue: {
            findSensorById: jest.fn(),
            sensorBelongsToCurrentUser: jest.fn(),
          },
        },
        {
          provide: SensorDataService,
          useValue: {
            createSensorData: jest.fn(),
            findAllSensorDataInInterval: jest.fn(),
            findLatestSensorData: jest.fn(),
            updateSensorDataById: jest.fn(),
            removeSensorDataById: jest.fn(),
          },
        },
      ],
    }).compile();

    sensorDataController = module.get<SensorDataController>(SensorDataController);
    sensorDataService = module.get<SensorDataService>(SensorDataService);
  });

  it('should be defined', () => {
    expect(sensorDataController).toBeDefined();
    expect(sensorDataService).toBeDefined();
  });

  it('should add data to a sensor', async () => {
    const createSensorDataDto: CreateSensorDataDto = {
      value: 2,
      rawValue: 355.23,
      timestamp: now,
    };
    const mockedResponse: SensorData = {
      value: 231,
      timestamp: now,
    } as SensorData;

    jest.spyOn(sensorDataService, 'createSensorData').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.addSensorData(mockedSensor.id, createSensorDataDto);

    expect(sensorDataService.createSensorData).toHaveBeenCalledWith(mockedSensor.id, createSensorDataDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should find all sensorData for a given sensor', async () => {
    const interval = {} as GetSensorDataByIntervalDto;
    const mockedResponse: SensorData[] = [
      {
        value: 24.1,
        timestamp: now,
      } as SensorData,
      {
        value: 23.1,
        timestamp: now,
      } as SensorData,
    ];

    jest.spyOn(sensorDataService, 'findAllSensorDataInInterval').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.getSensorData(mockedSensor.id, interval);

    expect(sensorDataService.findAllSensorDataInInterval).toHaveBeenCalledWith(mockedSensor.id, interval);
    expect(result).toEqual(mockedResponse);
  });

  it('should find the latest sensorData for a given sensor', async () => {
    const mockedResponse: SensorData = {
      value: 24.1,
      timestamp: now,
    } as SensorData;

    jest.spyOn(sensorDataService, 'findLatestSensorData').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.getLatestSensorData(mockedSensor.id);

    expect(sensorDataService.findLatestSensorData).toHaveBeenCalledWith(mockedSensor.id);
    expect(result).toEqual(mockedResponse);
  });

  it('should update sensordata by ID for a given sensor', async () => {
    const updateSensorDataDto = {
      id: 'zzz',
      value: 23,
      rawValue: 355.23,
      timestamp: now,
    };
    const mockedResponse: SensorData = {
      value: 231,
      timestamp: now,
    } as SensorData;

    jest.spyOn(sensorDataService, 'updateSensorDataById').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.updateSensorDataById(mockedSensor.id, updateSensorDataDto);

    expect(sensorDataService.updateSensorDataById).toHaveBeenCalledWith(mockedSensor.id, updateSensorDataDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete sensordata by ID for a given sensor', async () => {
    const sensorDataId = 'zzz';
    const mockedResponse: SensorData = {
      id: sensorDataId,
      value: 24.1,
      timestamp: now,
      sensor: {
        id: 'aaa',
      },
    } as SensorData;

    jest.spyOn(sensorDataService, 'removeSensorDataById').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.deleteSensorDataById(mockedSensor.id, sensorDataId);

    expect(sensorDataService.removeSensorDataById).toHaveBeenCalledWith(mockedSensor.id, sensorDataId);
    expect(result).toEqual(mockedResponse);
  });
});
