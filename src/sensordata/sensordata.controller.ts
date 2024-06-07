import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SensorsService } from '../sensors/sensors.service';
import { SensorDataService } from './sensordata.service';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';

@Controller('sensordata')
export class SensorDataController {
  constructor(
    private sensorsService: SensorsService,
    private sensorDataService: SensorDataService,
  ) {}

  @Post('/:id')
  async addSensorData(
    @Param('id') id: string,
    @Body() body: CreateSensorDataDto,
  ) {
    const sensor = await this.sensorsService.findSensorById(id);
    return await this.sensorDataService.createSensorData(sensor, body);
  }
}
