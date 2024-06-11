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
    const sensors = await this.sensorRepo.find();
    if (sensors.length === 0) {
      throw new NotFoundException('No sensors found');
    }

    return sensors;
  }

  async findAllSensorsOfType(type: string) {
    const sensors = await this.sensorRepo.find({ where: { type } });
    if (sensors.length === 0) {
      throw new NotFoundException('No sensors found');
    }

    return sensors;
  }

  async findSensorById(sensorId: string) {
    if (!sensorId) {
      return null;
    }

    const sensor = await this.sensorRepo.findOneBy({ id: sensorId });
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    return sensor;
  }

  async createSensor(createSensorDto: CreateSensorDto) {
    const sensorTypeInfo = SensorTypes.fromType(createSensorDto.type);
    const sensor = this.sensorRepo.create(createSensorDto);
    sensor.unit = sensorTypeInfo.unit;

    return this.sensorRepo.save(sensor);
  }

  async updateSensorById(sensorId: string, partialSensor: Partial<Sensor>) {
    const sensor = await this.findSensorById(sensorId);
    Object.assign(sensor, partialSensor);

    return this.sensorRepo.save(sensor);
  }

  async removeSensorById(sensorId: string) {
    const sensor = await this.findSensorById(sensorId);

    return this.sensorRepo.remove(sensor);
  }
}
