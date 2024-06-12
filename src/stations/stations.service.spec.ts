import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StationsService } from './stations.service';
import { Station } from './stations.entity';
import { CreateStationDto } from './dtos/create-station.dto';
import { UpdateStationDto } from './dtos/update-station.dto';

describe('StationsService', () => {
  let stationsService: StationsService;
  let stationRepository: Repository<Station>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StationsService,
        {
          provide: getRepositoryToken(Station),
          useClass: Repository,
        },
      ],
    }).compile();

    stationsService = module.get<StationsService>(StationsService);
    stationRepository = module.get<Repository<Station>>(getRepositoryToken(Station));
  });

  it('should be defined', () => {
    expect(stationsService).toBeDefined();
  });

  it('should create a station', async () => {
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

    jest.spyOn(stationRepository, 'create').mockReturnValue(mockedResponse);
    jest.spyOn(stationRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await stationsService.createStation(createStationDto);

    expect(stationRepository.create).toHaveBeenCalledWith(createStationDto);
    expect(stationRepository.save).toHaveBeenCalledWith(mockedResponse);
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

    jest.spyOn(stationRepository, 'find').mockResolvedValue(mockedResponse);
    const result = await stationsService.findAllStations();

    expect(stationRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockedResponse);
  });

  it('should find a station by ID', async () => {
    const mockedResponse: Station = {
      id: 'aaa',
      name: 'Station 1',
      description: 'Station 1',
      active: true,
    } as Station;

    jest.spyOn(stationRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    const result = await stationsService.findStationById('aaa');

    expect(stationRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
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

    jest.spyOn(stationRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(stationRepository, 'save').mockResolvedValue(mockedResponse);
    const result = await stationsService.updateStationById('aaa', updateStationDto);

    expect(stationRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(stationRepository.save).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });

  it('should delete a station by ID', async () => {
    const mockedResponse: Station = {
      id: 'aaa',
      name: 'Station 1',
      description: 'Station 1 Update',
      active: true,
    } as Station;

    jest.spyOn(stationRepository, 'findOneBy').mockResolvedValue(mockedResponse);
    jest.spyOn(stationRepository, 'remove').mockResolvedValue(mockedResponse);
    const result = await stationsService.removeStationById('aaa');

    expect(stationRepository.findOneBy).toHaveBeenCalledWith({ id: 'aaa' });
    expect(stationRepository.remove).toHaveBeenCalledWith(mockedResponse);
    expect(result).toEqual(mockedResponse);
  });
});
