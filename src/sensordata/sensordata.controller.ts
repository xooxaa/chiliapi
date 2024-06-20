import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiFoundResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { SensorExists } from '../interceptors/sensor-exists.interceptor';
import { SensorBelongsToUser } from '../interceptors/sensor-belongs-to-user.interceptor';
import { SensorDataService } from './sensordata.service';
import { SensorDataDto } from './dtos/sensordata.dto';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';
import { UpdateSensorDataDto } from './dtos/update-sensordata.dto';
import { GetSensorDataByIntervalDto } from './dtos/get-sensor-data-by.dto';

@ApiTags('sensordata')
@Controller('sensors/:sensorId/data')
@Serialize(SensorDataDto)
@UseInterceptors(SensorExists)
export class SensorDataController {
  constructor(private sensorDataService: SensorDataService) {}

  @Get('')
  @ApiFoundResponse({
    description: 'The sensordata has been successfully found for the given sensor.',
    type: [SensorDataDto],
  })
  async getSensorData(@Param('sensorId') sensorId: string, @Query() interval: GetSensorDataByIntervalDto) {
    return await this.sensorDataService.findAllSensorDataInInterval(sensorId, interval);
  }

  @Get('/latest')
  @ApiFoundResponse({
    description: 'The latest sensordata has been successfully found for the given sensor.',
    type: SensorDataDto,
  })
  async getLatestSensorData(@Param('sensorId') sensorId: string) {
    return await this.sensorDataService.findLatestSensorData(sensorId);
  }

  @Post('')
  @UseInterceptors(SensorBelongsToUser)
  @ApiCreatedResponse({
    description: 'The sensordata has been successfully added to the sensor.',
    type: SensorDataDto,
  })
  async addSensorData(@Param('sensorId') sensorId: string, @Body() body: CreateSensorDataDto) {
    return await this.sensorDataService.createSensorData(sensorId, body);
  }

  @Patch('')
  @UseInterceptors(SensorBelongsToUser)
  @ApiOkResponse({
    description: 'The sensordata has been successfully patched.',
    type: SensorDataDto,
  })
  async updateSensorDataById(@Param('sensorId') sensorId: string, @Body() body: UpdateSensorDataDto) {
    return await this.sensorDataService.updateSensorDataById(sensorId, body);
  }

  @Delete('/:sensorDataId')
  @UseInterceptors(SensorBelongsToUser)
  @ApiOkResponse({
    description: 'The sensordata has been successfully deleted.',
    type: SensorDataDto,
  })
  async deleteSensorDataById(@Param('sensorId') sensorId: string, @Param('sensorDataId') sensorDataId: string) {
    return await this.sensorDataService.removeSensorDataById(sensorId, sensorDataId);
  }
}
