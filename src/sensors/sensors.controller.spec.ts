import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { Sensor } from './sensors.entity';
import { Data } from './data.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { randomUUID } from 'crypto';

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
            updateSensorById: jest.fn(),
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
      id: 'aaa',
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

    jest.spyOn(service, 'findAllSensors').mockResolvedValue(mockedResponse);
    const result = await controller.getAllSensors();

    expect(service.findAllSensors).toHaveBeenCalled();
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

    jest
      .spyOn(service, 'findAllSensorsOfType')
      .mockResolvedValue(mockedResponse);
    const result = await controller.getAllSensorsOfType({ type: 'temp' });

    expect(service.findAllSensorsOfType).toHaveBeenCalledWith('temp');
    expect(result).toEqual(mockedResponse);
  });

  it('should return a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temp',
      active: true,
      createdAt: now,
      updatedAt: now,
    } as Sensor;

    jest.spyOn(service, 'findSensorById').mockResolvedValue(mockedResponse);
    const result = await controller.getSensorById('aaa');

    expect(service.findSensorById).toHaveBeenCalledWith('aaa');
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

    jest.spyOn(service, 'updateSensorById').mockResolvedValue(mockedResponse);
    const result = await controller.updateSensorById('aaa', updateSensorDto);

    expect(service.updateSensorById).toHaveBeenCalledWith(
      'aaa',
      updateSensorDto,
    );
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

    jest.spyOn(service, 'removeSensorById').mockResolvedValue(mockedResponse);
    const result = await controller.deleteSensorById('aaa');

    expect(service.removeSensorById).toHaveBeenCalledWith('aaa');
    expect(result).toEqual(mockedResponse);
  });
});
