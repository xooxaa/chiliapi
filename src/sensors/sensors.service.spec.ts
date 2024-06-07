import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorsService } from './sensors.service';
import { Sensor } from './sensors.entity';
import { SensorData } from './data.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';

describe('SensorsService', () => {
  let service: SensorsService;
  let sensorRepository: Repository<Sensor>;
  let dataRepository: Repository<SensorData>;

  const now = new Date(Date.now());

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsService,
        {
          provide: getRepositoryToken(Sensor),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SensorData),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SensorsService>(SensorsService);
    sensorRepository = module.get<Repository<Sensor>>(
      getRepositoryToken(Sensor),
    );
    dataRepository = module.get<Repository<SensorData>>(
      getRepositoryToken(SensorData),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a sensor', async () => {
    const createSensorDto: CreateSensorDto = { name: 'Sensor 1', type: 'temp' };
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(sensorRepository, 'create').mockReturnValue(mockedResponse);
    jest.spyOn(sensorRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await service.createSensor(createSensorDto);

    expect(sensorRepository.create).toHaveBeenCalledWith(createSensorDto);
    expect(sensorRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should return a list of sensors', async () => {
    const mockedResponse: Sensor[] = [
      {
        id: 'aaa',
        name: 'Sensor 1',
        type: 'temp',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
      {
        id: 'bbb',
        name: 'Sensor 2',
        type: 'humidity',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
    ];

    jest.spyOn(sensorRepository, 'find').mockResolvedValue(mockedResponse);
    const result = await service.findAllSensors();

    expect(sensorRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should return a list of sensors of a given type', async () => {
    const mockedResponse: Sensor[] = [
      {
        id: 'aaa',
        name: 'Sensor 1',
        type: 'temp',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
      {
        id: 'bbb',
        name: 'Sensor 2',
        type: 'temp',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
    ];

    jest.spyOn(sensorRepository, 'find').mockResolvedValue(mockedResponse);
    const result = await service.findAllSensorsOfType('temp');

    expect(sensorRepository.find).toHaveBeenCalledWith({
      where: { type: 'temp' },
    });
    expect(result).toEqual(mockedResponse);
  });

  it('should find a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(sensorRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    const result = await service.findSensorById('aaa');

    expect(sensorRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(result).toEqual(mockedResponse);
  });

  it('should update a sensor by ID', async () => {
    const updateSensorDto: UpdateSensorDto = { name: 'Sensor 1', type: 'temp' };
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(sensorRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(sensorRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await service.updateSensorById('aaa', updateSensorDto);

    expect(sensorRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(sensorRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(sensorRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(sensorRepository, 'remove').mockResolvedValue(mockedResponse);
    const result = await service.removeSensorById('aaa');

    expect(sensorRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(sensorRepository.remove).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });
});
