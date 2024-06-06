import { Test, TestingModule } from '@nestjs/testing';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { Sensor } from './sensors.entity';

describe('SensorsController', () => {
  let controller: SensorsController;
  let fakeSensorsService: Partial<SensorsService>;

  const now = new Date(Date.now());

  beforeEach(async () => {
    fakeSensorsService = {
      createSensor: (createSensorDto: CreateSensorDto) => {
        const { name, type } = createSensorDto;
        return Promise.resolve({
          id: 1,
          name,
          type,
          active: true,
          createdAt: now,
          updatedAt: now,
        } as Sensor);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsController],
      providers: [
        {
          provide: SensorsService,
          useValue: fakeSensorsService,
        },
      ],
    }).compile();

    controller = module.get<SensorsController>(SensorsController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('adding a sensor returns the apropiate sensor information', async () => {
    const sensor = await controller.createSensor({
      name: 'Sensor 1',
      type: 'temp',
    });

    expect(sensor.id).toEqual(1);
    expect(sensor.name).toEqual('Sensor 1');
    expect(sensor.type).toEqual('temp');
    expect(sensor.active).toEqual(true);
    expect(sensor.createdAt).toEqual(now);
    expect(sensor.updatedAt).toEqual(now);
  });
});
