import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './sensors.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { SensorTypes } from './sensors.types';

@Injectable()
export class SensorsService {
  constructor(@InjectRepository(Sensor) private readonly sensorRepo: Repository<Sensor>) {}

  async findAllSensors() {
    return this.sensorRepo.find();
  }

  async findAllSensorsOfType(type: string) {
    return this.sensorRepo.find({ where: { type } });
  }

  async findSensorById(sensorId: string) {
    if (!sensorId) {
      return null;
    }

    return this.sensorRepo.findOneBy({ id: sensorId });
  }

  async createSensor(createSensorDto: CreateSensorDto) {
    const sensorTypeInfo = SensorTypes.fromType(createSensorDto.type);
    const sensor = this.sensorRepo.create(createSensorDto);
    sensor.unit = sensorTypeInfo.unit;

    return this.sensorRepo.save(sensor);
  }

  async updateSensorById(sensorId: string, partialSensor: Partial<Sensor>) {
    const sensor = await this.findSensorById(sensorId);
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }
    Object.assign(sensor, partialSensor);

    return this.sensorRepo.save(sensor);
  }

  async removeSensorById(sensorId: string) {
    const sensor = await this.findSensorById(sensorId);
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }
    return this.sensorRepo.remove(sensor);
  }
}
