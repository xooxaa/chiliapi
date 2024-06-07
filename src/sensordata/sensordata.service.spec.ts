import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorDataService } from './sensordata.service';
import { Sensor } from '../sensors/sensors.entity';
import { SensorData } from './sensordata.entity';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';

describe('SensorDataService', () => {
  let sensorDataService: SensorDataService;
  let sensorDataRepository: Repository<SensorData>;
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
      providers: [
        SensorDataService,
        {
          provide: getRepositoryToken(SensorData),
          useClass: Repository,
        },
      ],
    }).compile();

    sensorDataService = module.get<SensorDataService>(SensorDataService);
    sensorDataRepository = module.get<Repository<SensorData>>(
      getRepositoryToken(SensorData),
    );
  });

  it('should be defined', () => {
    expect(sensorDataService).toBeDefined();
  });

  it('should create a new dataset for a given sensor', async () => {
    const createSensorDataDto: CreateSensorDataDto = {
      value: 2,
      rawValue: 355.23,
    };
    const mockedResponse: SensorData = {
      value: 231,
      createdAt: now,
    } as SensorData;

    jest.spyOn(sensorDataRepository, 'create').mockReturnValue(mockedResponse);
    jest.spyOn(sensorDataRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await sensorDataService.createSensorData(
      testSensor,
      createSensorDataDto,
    );

    expect(sensorDataRepository.create).toHaveBeenCalledWith(
      createSensorDataDto,
    );
    expect(sensorDataRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });
});
