import { Controller, Post, Body } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dtos/create-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private sensorsService: SensorsService) {}

  @Post()
  createSensor(@Body() body: CreateSensorDto) {
    this.sensorsService.createSensor(body);
  }
}
