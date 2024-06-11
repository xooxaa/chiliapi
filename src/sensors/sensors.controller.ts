import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { SensorsService } from './sensors.service';
import { SensorDto } from './dtos/sensor.dto';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { GetSensorByTypeDto } from './dtos/get-sensor-by.dto';

@ApiTags('sensors')
@Controller('sensors')
@Serialize(SensorDto)
export class SensorsController {
  constructor(private sensorsService: SensorsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Sensors have been successfully found.',
    type: [SensorDto],
  })
  async getAllSensors() {
    return await this.sensorsService.findAllSensors();
  }

  @Get('/of')
  @ApiOkResponse({
    description: 'Sensors have been successfully found.',
    type: [SensorDto],
  })
  async getAllSensorsOfType(@Query() query: GetSensorByTypeDto) {
    return await this.sensorsService.findAllSensorsOfType(query.type);
  }

  @Get('/:sensorId')
  @ApiOkResponse({
    description: 'Sensor has been successfully found.',
    type: SensorDto,
  })
  @ApiNotFoundResponse({
    description: 'Sensor not found.',
  })
  async getSensorById(@Param('sensorId') sensorId: string) {
    const sensor = await this.sensorsService.findSensorById(sensorId);
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    return sensor;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The sensor has been successfully created.',
    type: SensorDto,
  })
  async addSensor(@Body() body: CreateSensorDto) {
    return await this.sensorsService.createSensor(body);
  }

  @Patch('/:sensorId')
  @ApiOkResponse({
    description: 'The sensor has been successfully patched.',
    type: SensorDto,
  })
  async updateSensorById(@Param('sensorId') sensorId: string, @Body() body: UpdateSensorDto) {
    return await this.sensorsService.updateSensorById(sensorId, body);
  }

  @Delete('/:sensorId')
  @ApiOkResponse({
    description: 'The sensor has been successfully deleted.',
    type: SensorDto,
  })
  async deleteSensorById(@Param('sensorId') sensorId: string) {
    return await this.sensorsService.removeSensorById(sensorId);
  }
}
