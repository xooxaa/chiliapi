import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dtos/create-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private sensorsService: SensorsService) {}

  @Get()
  async getAllSensors() {
    return await this.sensorsService.findAllSensors();
  }

  @Get('/of')
  async getAllSensorsOfType(@Query() query: any) {
    return await this.sensorsService.findAllSensorsOfType(query.type);
  }

  @Get('/:id')
  async getSensorById(@Param('id') id: string) {
    return await this.sensorsService.findSensorById(parseInt(id));
  }

  @Post()
  async createSensor(@Body() body: CreateSensorDto) {
    return await this.sensorsService.createSensor(body);
  }

  @Delete('/:id')
  async deleteSensorById(@Param('id') id: string) {
    return await this.sensorsService.removeSensorById(parseInt(id));
  }
}
