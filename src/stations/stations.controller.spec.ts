import { Test, TestingModule } from '@nestjs/testing';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { Station } from './stations.entity';
import { CreateStationDto } from './dtos/create-station.dto';
import { UpdateStationDto } from './dtos/update-station.dto';

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

  it('should add a station', async () => {
    const createStationDto: CreateStationDto = {
      name: 'Station 1',
      description: 'Station 1',
    };
    const mockedResponse: Station = {
      id: 'aaa',
      name: 'Station 1',
      description: 'Station 1',
      active: true,
    } as Station;

    jest.spyOn(stationsService, 'createStation').mockResolvedValue(mockedResponse);
    const result = await stationsController.addStation(createStationDto);

    expect(stationsService.createStation).toHaveBeenCalledWith(createStationDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should return a list of stations', async () => {
    const mockedResponse: Station[] = [
      {
        id: 'aaa',
        name: 'Station 1',
        description: 'Station 1',
        active: true,
      } as Station,
      {
        id: 'bbb',
        name: 'Station 2',
        description: 'Station 2',
        active: true,
      } as Station,
    ];

    jest.spyOn(stationsService, 'findAllStations').mockResolvedValue(mockedResponse);
    const result = await stationsController.getAllStations();

    expect(stationsService.findAllStations).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should return a station by ID', async () => {
    const mockedResponse: Station = {
      id: 'aaa',
      name: 'Station 1',
      description: 'Station 1',
      active: true,
    } as Station;

    jest.spyOn(stationsService, 'findStationById').mockResolvedValue(mockedResponse);
    const result = await stationsController.getStationById('aaa');

    expect(stationsService.findStationById).toHaveBeenCalledWith('aaa');
    expect(result).toEqual(mockedResponse);
  });

  it('should update a station by ID', async () => {
    const updateStationDto: UpdateStationDto = {
      name: 'Station 1',
      description: 'Station 1 Update',
    };
    const mockedResponse: Station = {
      id: 'aaa',
      name: 'Station 1',
      description: 'Station 1 Update',
      active: true,
    } as Station;

    jest.spyOn(stationsService, 'updateStationById').mockResolvedValue(mockedResponse);
    const result = await stationsController.updateStationById('aaa', updateStationDto);

    expect(stationsService.updateStationById).toHaveBeenCalledWith('aaa', updateStationDto);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a station by ID', async () => {
    const mockedResponse: Station = {
      id: 'aaa',
      name: 'Station 1',
      description: 'Station 1',
      active: true,
    } as Station;

    jest.spyOn(stationsService, 'removeStationById').mockResolvedValue(mockedResponse);
    const result = await stationsController.deleteStationById('aaa');

    expect(stationsService.removeStationById).toHaveBeenCalledWith('aaa');
    expect(result).toEqual(mockedResponse);
  });
});
