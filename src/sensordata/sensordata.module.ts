import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsModule } from '../sensors/sensors.module';
import { SensorDataController } from './sensordata.controller';
import { SensorDataService } from './sensordata.service';
import { SensorData } from './sensordata.entity';

@Module({
  imports: [SensorsModule, TypeOrmModule.forFeature([SensorData])],
  controllers: [SensorDataController],
  providers: [SensorDataService],
})
export class SensorDataModule {}
