import { Test, TestingModule } from '@nestjs/testing';
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
          provide: SensorsService,
          useValue: {
            createSensor: jest.fn(),
            findAllSensors: jest.fn(),
            findAllSensorsOfType: jest.fn(),
            findSensorById: jest.fn(),
            removeSensorById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
    service = module.get<SensorsService>(SensorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a sensor', async () => {
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

    expect(service.createSensor).toHaveBeenCalledWith(createSensorDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should return a list of sensors', async () => {
    const mockedResponse: Sensor[] = [
      {
        id: 1,
        name: 'Sensor 1',
        type: 'temp',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
      {
        id: 2,
        name: 'Sensor 2',
        type: 'humidity',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
    ];

    jest.spyOn(service, 'findAllSensors').mockResolvedValue(mockedResponse);
    const result = await controller.getAllSensors();

    expect(service.findAllSensors).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should return a list of sensors of a given type', async () => {
    const mockedResponse: Sensor[] = [
      {
        id: 1,
        name: 'Sensor 1',
        type: 'temp',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
      {
        id: 2,
        name: 'Sensor 2',
        type: 'temp',
        active: true,
        createdAt: now,
        updatedAt: now,
      } as Sensor,
    ];

    jest
      .spyOn(service, 'findAllSensorsOfType')
      .mockResolvedValue(mockedResponse);
    const result = await controller.getAllSensorsOfType({ type: 'temp' });

    expect(service.findAllSensorsOfType).toHaveBeenCalledWith('temp');
    expect(result).toEqual(mockedResponse);
  });

  it('should return a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 1,
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(service, 'findSensorById').mockResolvedValue(mockedResponse);
    const result = await controller.getSensorById('1');

    expect(service.findSensorById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 1,
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(service, 'removeSensorById').mockResolvedValue(mockedResponse);
    const result = await controller.deleteSensorById('1');

    expect(service.removeSensorById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockedResponse);
  });
});
