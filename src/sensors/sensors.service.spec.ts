import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorsService } from './sensors.service';
import { Sensor } from './sensors.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { User } from '../users/users.entity';

describe('SensorsService', () => {
  let sensorsService: SensorsService;
  let sensorRepository: Repository<Sensor>;

  const mockedUser = {
    id: 'lll',
    name: 'User One',
    email: 'one@some.user',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsService,
        {
          provide: getRepositoryToken(Sensor),
          useClass: Repository,
        },
      ],
    }).compile();

    sensorsService = module.get<SensorsService>(SensorsService);
    sensorRepository = module.get<Repository<Sensor>>(getRepositoryToken(Sensor));
  });

  it('should be defined', () => {
    expect(sensorsService).toBeDefined();
    expect(sensorRepository).toBeDefined();
  });

  it('should create a sensor', async () => {
    const createSensorDto: CreateSensorDto = {
      name: 'Sensor 1',
      description: '',
      type: 'temperature',
    };
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
      userId: 'lll',
    } as Sensor;

    jest.spyOn(sensorRepository, 'create').mockReturnValue(mockedResponse);
    jest.spyOn(sensorRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await sensorsService.createSensor(createSensorDto, mockedUser);

    expect(sensorRepository.create).toHaveBeenCalledWith(createSensorDto);
    expect(sensorRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should return a list of sensors', async () => {
    const mockedResponse: Sensor[] = [
      {
        id: 'aaa',
        name: 'Sensor 1',
        type: 'temperature',
        unit: 'Celsius',
        active: true,
        userId: 'lll',
      } as Sensor,
      {
        id: 'bbb',
        name: 'Sensor 2',
        type: 'humidity',
        unit: 'Percentage',
        active: true,
        userId: 'lll',
      } as Sensor,
    ];

    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockedResponse),
    };

    jest.spyOn(sensorRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilderMock as any);
    const result = await sensorsService.findAllSensorsOfType();

    expect(createQueryBuilderMock.getMany).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should return a list of sensors of a given type', async () => {
    const mockedResponse: Sensor[] = [
      {
        id: 'aaa',
        name: 'Sensor 1',
        type: 'temperature',
        unit: 'Celsius',
        active: true,
        userId: 'lll',
      } as Sensor,
      {
        id: 'bbb',
        name: 'Sensor 2',
        type: 'temperature',
        unit: 'Celsius',
        active: true,
        userId: 'lll',
      } as Sensor,
    ];

    const createQueryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockedResponse),
    };

    jest.spyOn(sensorRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilderMock as any);
    const result = await sensorsService.findAllSensorsOfType('temperature');

    expect(createQueryBuilderMock.where).toHaveBeenCalled();
    expect(createQueryBuilderMock.getMany).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should find a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
      userId: 'lll',
    } as Sensor;

    jest.spyOn(sensorRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    const result = await sensorsService.findSensorById('aaa');

    expect(sensorRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(result).toEqual(mockedResponse);
  });

  it('should update a sensor by ID', async () => {
    const updateSensorDto: UpdateSensorDto = {
      name: 'Sensor 1',
      type: 'temperature',
    };
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
      userId: 'lll',
    } as Sensor;

    jest.spyOn(sensorRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(sensorRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await sensorsService.updateSensorById('aaa', updateSensorDto, mockedUser);

    expect(sensorRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(sensorRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
      userId: 'lll',
    } as Sensor;

    jest.spyOn(sensorRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(sensorRepository, 'remove').mockResolvedValue(mockedResponse);
    const result = await sensorsService.removeSensorById('aaa', mockedUser);

    expect(sensorRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(sensorRepository.remove).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });
});
