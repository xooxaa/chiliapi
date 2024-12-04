import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './sensors.entity';
import { CreateSensorDto } from './dtos/create-sensor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { SensorTypes } from './sensors.types';
import { User } from '../users/users.entity';

@Injectable()
export class SensorsService {
  constructor(@InjectRepository(Sensor) private readonly sensorRepo: Repository<Sensor>) {}

  async findAllSensorsOfType(type?: string) {
    const queryBuilder = this.sensorRepo.createQueryBuilder('sensorData');
    if (type) {
      queryBuilder.where('type = :type', { type });
    }

    return queryBuilder.getMany();
  }

  async findSensorById(sensorId: string) {
    const sensor = await this.sensorRepo.findOneBy({ id: sensorId });
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    return sensor;
  }

  async createSensor(createSensorDto: CreateSensorDto, user: User) {
    const sensor = this.sensorRepo.create(createSensorDto);
    const sensorTypeInfo = SensorTypes.fromType(createSensorDto.type);
    sensor.userId = user.id;

    return this.sensorRepo.save(sensor);
  }

  async updateSensorById(sensorId: string, updateSensor: UpdateSensorDto, user: User) {
    const sensor = await this.findSensorById(sensorId);
    if (updateSensor.type) {
      const sensorTypeInfo = SensorTypes.fromType(updateSensor.type);
    }
    Object.assign(sensor, updateSensor);

    return this.sensorRepo.save(sensor);
  }

  async removeSensorById(sensorId: string, user: User) {
    const sensor = await this.findSensorById(sensorId);

    return this.sensorRepo.remove(sensor);
  }

  async returnSensorTypes() {
    return SensorTypes.ALL_TYPES;
  }
}
