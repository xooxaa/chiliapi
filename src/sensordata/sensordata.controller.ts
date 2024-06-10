import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiFoundResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { SensorsService } from '../sensors/sensors.service';
import { SensorDataService } from './sensordata.service';
import { SensorDataDto } from './dtos/sensordata.dto';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';
import { UpdateSensorDataDto } from './dtos/update-sensordata.dto';

@ApiTags('sensordata')
@Controller('sensors/:sensorId/data')
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

  @Get('/current')
  @ApiFoundResponse({
    description: 'The SensorData have been successfully found for the given sensor.',
    type: SensorDataDto,
  })
  async getCurrentSensorData(@Param('sensorId') sensorId: string) {
    return await this.sensorDataService.findCurrentSensorData(sensorId);
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

  @Patch('')
  @ApiOkResponse({
    description: 'The sensordata has been successfully patched.',
    type: SensorDataDto,
  })
  async updateSensorDataById(@Param('sensorId') sensorId: string, @Body() body: UpdateSensorDataDto) {
    return await this.sensorDataService.updateSensorDataById(sensorId, body);
  }

  @Delete('/:sensorDataId')
  @ApiOkResponse({
    description: 'The sensordata has been successfully deleted.',
    type: SensorDataDto,
  })
  async deleteSensorDataById(@Param('sensorId') sensorId: string, @Param('sensorDataId') sensorDataId: string) {
    return await this.sensorDataService.removeSensorDataById(sensorId, sensorDataId);
  }
}
