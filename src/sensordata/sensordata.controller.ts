import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiFoundResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { SensorsService } from '../sensors/sensors.service';
import { SensorDataService } from './sensordata.service';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';
import { SensorDataDto } from './dtos/sensordata.dto';

@ApiTags('sensordata')
@Controller('sensors/:sensorID/data')
@Serialize(SensorDataDto)
export class SensorDataController {
  constructor(
    private sensorsService: SensorsService,
    private sensorDataService: SensorDataService,
  ) {}

  @Get('')
  @ApiFoundResponse({
    description: 'The SensorData have been successfully found for the given sensor.',
    type: [SensorDataDto],
  })
  async getAllSensorData(@Param('sensorId') sensorId: string) {
    const sensor = await this.sensorsService.findSensorById(sensorId);
    return await this.sensorDataService.findAllSensorData(sensor);
  }

  @Post('')
  @ApiCreatedResponse({
    description: 'The sensordata has been successfully added to the sensor.',
    type: SensorDataDto,
  })
  async addSensorData(@Param('sensorId') sensorId: string, @Body() body: CreateSensorDataDto) {
    const sensor = await this.sensorsService.findSensorById(sensorId);
    return await this.sensorDataService.createSensorData(sensor, body);
  }
}
