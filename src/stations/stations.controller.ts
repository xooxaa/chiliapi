import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { StationsService } from './stations.service';
import { StationDto } from './dtos/station.dto';
import { CreateStationDto } from './dtos/create-station.dto';
import { UpdateStationDto } from './dtos/update-station.dto';
import { SensorDto } from '../sensors/dtos/sensor.dto';

@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private stationService: StationsService) {}

  @Get()
  @Serialize(StationDto)
  @ApiOkResponse({
    description: 'Stations have been successfully found.',
    type: [StationDto],
  })
  async getAllStations() {
    return await this.stationService.findAllStations();
  }

  @Get('/:stationId')
  @Serialize(StationDto)
  @ApiOkResponse({
    description: 'Station has been successfully found.',
    type: StationDto,
  })
  @ApiNotFoundResponse({
    description: 'Station not found.',
  })
  async getStationById(@Param('stationId') stationId: string) {
    return await this.stationService.findStationById(stationId);
  }

  @Get('/:stationId/sensors')
  @Serialize(SensorDto)
  @ApiOkResponse({
    description: 'The stations sensors has been successfully found.',
    type: [SensorDto],
  })
  @ApiNotFoundResponse({
    description: 'Station not found.',
  })
  async getSensorsByStationId(@Param('stationId') stationId: string) {
    return await this.stationService.findSensorsByStationId(stationId);
  }

  @Post()
  @Serialize(StationDto)
  @ApiCreatedResponse({
    description: 'The station has been successfully created.',
    type: StationDto,
  })
  async addStation(@Body() body: CreateStationDto) {
    return await this.stationService.createStation(body);
  }

  @Patch('/:stationId')
  @Serialize(StationDto)
  @ApiOkResponse({
    description: 'The station has been successfully patched.',
    type: StationDto,
  })
  async updateStationById(@Param('stationId') stationId: string, @Body() body: UpdateStationDto) {
    return await this.stationService.updateStationById(stationId, body);
  }

  @Delete('/:stationId')
  @Serialize(StationDto)
  @ApiOkResponse({
    description: 'The station has been successfully deleted.',
    type: StationDto,
  })
  async deleteStationById(@Param('stationId') stationId: string) {
    return await this.stationService.removeStationById(stationId);
  }
}
