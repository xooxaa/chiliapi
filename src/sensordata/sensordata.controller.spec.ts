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
  const testSensor: Sensor = {
    id: 'aaa',
    name: 'Sensor 1',
    type: 'temperature',
    unit: 'Celsius',
    active: true,
    createdAt: now,
    updatedAt: now,
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
          },
        },
        {
          provide: SensorDataService,
          useValue: {
            createSensorData: jest.fn(),
            findAllSensorData: jest.fn(),
            updateSensorDataById: jest.fn(),
            removeSensorDataById: jest.fn(),
          },
        },
      ],
    }).compile();

    sensorDataController = module.get<SensorDataController>(SensorDataController);
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

    jest.spyOn(sensorsService, 'findSensorById').mockResolvedValue(testSensor);
    jest.spyOn(sensorDataService, 'createSensorData').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.addSensorData(testSensor.id, createSensorDataDto);

    expect(sensorsService.findSensorById).toHaveBeenCalledWith(testSensor.id);
    expect(sensorDataService.createSensorData).toHaveBeenCalledWith(testSensor, createSensorDataDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should find all sensorData for a given sensor', async () => {
    const mockedResponse: SensorData[] = [
      {
        value: 24.1,
        createdAt: now,
      } as SensorData,
      {
        value: 23.1,
        createdAt: now,
      } as SensorData,
    ];

    jest.spyOn(sensorsService, 'findSensorById').mockResolvedValue(testSensor);
    jest.spyOn(sensorDataService, 'findAllSensorData').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.getAllSensorData(testSensor.id);

    expect(sensorsService.findSensorById).toHaveBeenCalledWith(testSensor.id);
    expect(sensorDataService.findAllSensorData).toHaveBeenCalledWith(testSensor);
    expect(result).toEqual(mockedResponse);
  });

  it('should update sensordata by ID for a given sensor', async () => {
    const updateSensorDataDto = {
      id: 'zzz',
      value: 23,
      rawValue: 355.23,
    };
    const mockedResponse: SensorData = {
      value: 231,
      createdAt: now,
    } as SensorData;

    jest.spyOn(sensorDataService, 'updateSensorDataById').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.updateSensorDataById(testSensor.id, updateSensorDataDto);

    expect(sensorDataService.updateSensorDataById).toHaveBeenCalledWith(testSensor.id, updateSensorDataDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete sensordata by ID for a given sensor', async () => {
    const sensorDataId = 'zzz';
    const mockedResponse: SensorData = {
      id: sensorDataId,
      value: 24.1,
      createdAt: now,
      sensor: {
        id: 'aaa',
      },
    } as SensorData;

    jest.spyOn(sensorDataService, 'removeSensorDataById').mockResolvedValue(mockedResponse);
    const result = await sensorDataController.deleteSensorDataById(testSensor.id, sensorDataId);

    expect(sensorDataService.removeSensorDataById).toHaveBeenCalledWith(testSensor.id, sensorDataId);
    expect(result).toEqual(mockedResponse);
  });
});
