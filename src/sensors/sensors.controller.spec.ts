import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { Sensor } from './sensors.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';

describe('SensorsController', () => {
  let sensorsController: SensorsController;
  let sensorsService: SensorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        SensorsService,
        {
          provide: SensorsService,
          useValue: {
            createSensor: jest.fn(),
            findAllSensorsOfType: jest.fn(),
            findSensorById: jest.fn(),
            updateSensorById: jest.fn(),
            removeSensorById: jest.fn(),
          },
        },
      ],
    }).compile();

    sensorsController = module.get<SensorsController>(SensorsController);
    sensorsService = module.get<SensorsService>(SensorsService);
  });

  it('should be defined', () => {
    expect(sensorsController).toBeDefined();
  });

  it('should add a sensor', async () => {
    const createSensorDto: CreateSensorDto = {
      name: 'Sensor 1',
      type: 'temperature',
    };
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
    } as Sensor;

    jest.spyOn(sensorsService, 'createSensor').mockResolvedValue(mockedResponse);
    const result = await sensorsController.addSensor(createSensorDto);

    expect(sensorsService.createSensor).toHaveBeenCalledWith(createSensorDto);
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
      } as Sensor,
      {
        id: 'bbb',
        name: 'Sensor 2',
        type: 'humidity',
        unit: 'Percentage',
        active: true,
      } as Sensor,
    ];

    jest.spyOn(sensorsService, 'findAllSensorsOfType').mockResolvedValue(mockedResponse);
    const result = await sensorsController.getAllSensorsOfType();

    expect(sensorsService.findAllSensorsOfType).toHaveBeenCalled();
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
      } as Sensor,
      {
        id: 'bbb',
        name: 'Sensor 2',
        type: 'temperature',
        unit: 'Celsius',
        active: true,
      } as Sensor,
    ];

    jest.spyOn(sensorsService, 'findAllSensorsOfType').mockResolvedValue(mockedResponse);
    const result = await sensorsController.getAllSensorsOfType('temperature');

    expect(sensorsService.findAllSensorsOfType).toHaveBeenCalledWith('temperature');
    expect(result).toEqual(mockedResponse);
  });

  it('should return a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
    } as Sensor;

    jest.spyOn(sensorsService, 'findSensorById').mockResolvedValue(mockedResponse);
    const result = await sensorsController.getSensorById('aaa');

    expect(sensorsService.findSensorById).toHaveBeenCalledWith('aaa');
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
    } as Sensor;

    jest.spyOn(sensorsService, 'updateSensorById').mockResolvedValue(mockedResponse);
    const result = await sensorsController.updateSensorById('aaa', updateSensorDto);

    expect(sensorsService.updateSensorById).toHaveBeenCalledWith('aaa', updateSensorDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a sensor by ID', async () => {
    const mockedResponse: Sensor = {
      id: 'aaa',
      name: 'Sensor 1',
      type: 'temperature',
      unit: 'Celsius',
      active: true,
    } as Sensor;

    jest.spyOn(sensorsService, 'removeSensorById').mockResolvedValue(mockedResponse);
    const result = await sensorsController.deleteSensorById('aaa');

    expect(sensorsService.removeSensorById).toHaveBeenCalledWith('aaa');
    expect(result).toEqual(mockedResponse);
  });
});
