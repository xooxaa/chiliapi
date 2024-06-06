import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './sensors.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor) private readonly repo: Repository<Sensor>,
  ) {}

  async createSensor(createSensorDto: CreateSensorDto) {
    const sensor = this.repo.create(createSensorDto);
    sensor.createdAt = new Date(Date.now());
    sensor.updatedAt = sensor.createdAt;

    return this.repo.save(sensor);
  }
}
