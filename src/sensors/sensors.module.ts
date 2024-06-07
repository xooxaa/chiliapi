import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensors.entity';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { SensorData } from '../sensordata/sensordata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorData])],
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
