import { Test, TestingModule } from '@nestjs/testing';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';

describe('StationsController', () => {
  let stationsController: StationsController;
  let stationsService: StationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StationsController],
      providers: [
        StationsService,
        {
          provide: StationsService,
          useValue: {
            createStation: jest.fn(),
            findAllStations: jest.fn(),
            findStationById: jest.fn(),
            updateStationById: jest.fn(),
            removeStationById: jest.fn(),
          },
        },
      ],
    }).compile();

    stationsController = module.get<StationsController>(StationsController);
    stationsService = module.get<StationsService>(StationsService);
  });

  it('should be defined', () => {
    expect(stationsController).toBeDefined();
  });
});
