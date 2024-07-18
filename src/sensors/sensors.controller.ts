import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/users.entity';
import { SensorsService } from './sensors.service';
import { SensorDto } from './dtos/sensor.dto';
import { SensorTypeDto } from './dtos/sensor-type.dto';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';

@ApiTags('sensors')
@Controller('sensors')
@UseGuards(AuthGuard)
export class SensorsController {
  constructor(private sensorsService: SensorsService) {}

  @Get()
  @Serialize(SensorDto)
  @ApiOkResponse({
    description: 'Sensors have been successfully found.',
    type: [SensorDto],
  })
  async getAllSensorsOfType(@Query('type') type?: string) {
    return await this.sensorsService.findAllSensorsOfType(type);
  }

  @Get('/types')
  @Serialize(SensorTypeDto)
  @ApiOkResponse({
    description: 'Sensor types have been successfully found.',
    type: [SensorTypeDto],
  })
  async getSensorTypes() {
    return await this.sensorsService.returnSensorTypes();
  }

  @Get('/:sensorId')
  @Serialize(SensorDto)
  @ApiOkResponse({
    description: 'Sensor has been successfully found.',
    type: SensorDto,
  })
  @ApiNotFoundResponse({
    description: 'Sensor not found.',
  })
  async getSensorById(@Param('sensorId') sensorId: string) {
    return await this.sensorsService.findSensorById(sensorId);
  }

  @Post()
  @Serialize(SensorDto)
  @ApiCreatedResponse({
    description: 'The sensor has been successfully created.',
    type: SensorDto,
  })
  async addSensor(@Body() body: CreateSensorDto, @CurrentUser() user: User) {
    return await this.sensorsService.createSensor(body, user);
  }

  @Patch('/:sensorId')
  @Serialize(SensorDto)
  @ApiOkResponse({
    description: 'The sensor has been successfully patched.',
    type: SensorDto,
  })
  async updateSensorById(
    @Param('sensorId') sensorId: string,
    @Body() body: UpdateSensorDto,
    @CurrentUser() user: User,
  ) {
    return await this.sensorsService.updateSensorById(sensorId, body, user);
  }

  @Delete('/:sensorId')
  @Serialize(SensorDto)
  @ApiOkResponse({
    description: 'The sensor has been successfully deleted.',
    type: SensorDto,
  })
  async deleteSensorById(@Param('sensorId') sensorId: string, @CurrentUser() user: User) {
    return await this.sensorsService.removeSensorById(sensorId, user);
  }
}
