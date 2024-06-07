import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';
import { SensorData } from './sensordata.entity';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepo: Repository<SensorData>,
  ) {}

  async createSensorData(
    sensor: Sensor,
    createSensorDataDto: CreateSensorDataDto,
  ) {
    const sensorData = this.sensorDataRepo.create(createSensorDataDto);
    sensorData.sensor = sensor;

    return this.sensorDataRepo.save(sensorData);
  }
}
