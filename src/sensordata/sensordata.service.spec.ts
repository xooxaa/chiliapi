import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorDataService } from './sensordata.service';
import { Sensor } from '../sensors/sensors.entity';
import { SensorData } from './sensordata.entity';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';
import { UpdateSensorDataDto } from './dtos/update-sensordata.dto';
import { GetSensorDataByIntervalDto } from './dtos/get-sensor-data-by.dto';
import { User } from '../users/users.entity';

describe('SensorDataService', () => {
  let sensorDataService: SensorDataService;
  let sensorDataRepository: Repository<SensorData>;

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
      providers: [
        SensorDataService,
        {
          provide: getRepositoryToken(SensorData),
          useClass: Repository,
        },
      ],
    }).compile();

    sensorDataService = module.get<SensorDataService>(SensorDataService);
    sensorDataRepository = module.get<Repository<SensorData>>(getRepositoryToken(SensorData));
  });

  it('should be defined', () => {
    expect(sensorDataService).toBeDefined();
    expect(sensorDataRepository).toBeDefined();
  });

  it('should create new sensorData for a given sensor', async () => {
    const createSensorDataDto: CreateSensorDataDto = {
      value: 2,
      rawValue: 355.23,
      timestamp: now,
    };
    const mockedResponse: SensorData = {
      value: 231,
      createdAt: now,
    } as SensorData;

    jest.spyOn(sensorDataRepository, 'create').mockReturnValue(mockedResponse);
    jest.spyOn(sensorDataRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await sensorDataService.createSensorData(mockedSensor.id, createSensorDataDto);

    expect(sensorDataRepository.create).toHaveBeenCalledWith(createSensorDataDto);
    expect(sensorDataRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should find all sensorData within a given interval for a given sensor', async () => {
    const interval = {} as GetSensorDataByIntervalDto;
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

    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockedResponse),
    };

    jest.spyOn(sensorDataRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilderMock as any);
    const result = await sensorDataService.findAllSensorDataInInterval(mockedSensor.id, interval);

    expect(createQueryBuilderMock.where).toHaveBeenCalledWith('sensorId = :sensorId', { sensorId: 'aaa' });
    expect(createQueryBuilderMock.orderBy).toHaveBeenCalledWith('sensorData.timestamp', 'ASC');
    expect(createQueryBuilderMock.getMany).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should find the latest sensorData for a given sensor', async () => {
    const mockedResponse: SensorData = {
      id: 'zzz',
      value: 24.1,
      createdAt: now,
      sensorId: 'aaa',
    } as SensorData;

    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockedResponse),
    };

    jest.spyOn(sensorDataRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilderMock as any);
    const result = await sensorDataService.findLatestSensorData(mockedSensor.id);

    expect(createQueryBuilderMock.where).toHaveBeenCalledWith('sensorId = :sensorId', { sensorId: 'aaa' });
    expect(createQueryBuilderMock.orderBy).toHaveBeenCalledWith('sensorData.timestamp', 'DESC');
    expect(createQueryBuilderMock.getOne).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should update sensorData by ID for a given sensor', async () => {
    const updateSensorDataDto: UpdateSensorDataDto = {
      id: 'zzz',
      value: 22.1,
      rawValue: 355.23,
      timestamp: now,
    };
    const mockedResponseBeforeUpdate: SensorData = {
      value: 24.1,
      timestamp: now,
      sensorId: 'aaa',
    } as SensorData;
    const mockedResponseAfterUpdate: SensorData = {
      value: 22.1,
      timestamp: now,
      sensorId: 'aaa',
    } as SensorData;

    jest.spyOn(sensorDataRepository, 'findOneBy').mockResolvedValue(mockedResponseBeforeUpdate);
    jest.spyOn(sensorDataRepository, 'save').mockResolvedValue(mockedResponseAfterUpdate);
    const result = await sensorDataService.updateSensorDataById(mockedSensor.id, updateSensorDataDto);

    expect(sensorDataRepository.findOneBy).toHaveBeenCalledWith({ id: updateSensorDataDto.id });
    expect(sensorDataRepository.save).toHaveBeenCalledWith(mockedResponseBeforeUpdate);
    expect(result).toEqual(mockedResponseAfterUpdate);
  });

  it('should delete sensorData by ID for a given sensor', async () => {
    const sensorDataId = 'zzz';
    const mockedResponse: SensorData = {
      id: sensorDataId,
      value: 24.1,
      timestamp: now,
      sensorId: 'aaa',
    } as SensorData;

    jest.spyOn(sensorDataRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(sensorDataRepository, 'remove').mockResolvedValue(mockedResponse);
    const result = await sensorDataService.removeSensorDataById(mockedSensor.id, sensorDataId);

    expect(sensorDataRepository.findOneBy).toHaveBeenCalledWith({ id: sensorDataId });
    expect(sensorDataRepository.remove).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });
});
