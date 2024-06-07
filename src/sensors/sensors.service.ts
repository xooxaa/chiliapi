import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './sensors.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor) private readonly repo: Repository<Sensor>,
  ) {}

  async findAllSensors() {
    return this.repo.find();
  }

  async findAllSensorsOfType(type: string) {
    return this.repo.find({ where: { type } });
  }

  async findSensorById(id: string) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  async createSensor(createSensorDto: CreateSensorDto) {
    const sensor = this.repo.create(createSensorDto);
    sensor.createdAt = new Date(Date.now());
    sensor.updatedAt = sensor.createdAt;

    return this.repo.save(sensor);
  }

  async updateSensorById(id: string, partialSensor: Partial<Sensor>) {
    const sensor = await this.findSensorById(id);
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }
    Object.assign(sensor, partialSensor);
    sensor.updatedAt = new Date(Date.now());

    return this.repo.save(sensor);
  }

  async removeSensorById(id: string) {
    const sensor = await this.findSensorById(id);
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }
    return this.repo.remove(sensor);
  }
}
