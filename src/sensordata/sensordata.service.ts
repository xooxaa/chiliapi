import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';
import { SensorData } from './sensordata.entity';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';
import { UpdateSensorDataDto } from './dtos/update-sensordata.dto';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepo: Repository<SensorData>,
  ) {}

  async findAllSensorData(sensor: Sensor) {
    return this.sensorDataRepo.find({ where: { sensor } });
  }

  async findLatestSensorData(sensorId: string) {
    return this.sensorDataRepo
      .createQueryBuilder('sensorData')
      .where('sensorId = :sensorId', { sensorId })
      .orderBy('sensorData.createdAt', 'DESC')
      .getOne();
  }

  async findSensorDataById(sensorDataId: string) {
    return this.sensorDataRepo.findOneBy({ id: sensorDataId });
  }

  async createSensorData(sensor: Sensor, createSensorDataDto: CreateSensorDataDto) {
    const sensorData = this.sensorDataRepo.create(createSensorDataDto);
    sensorData.sensor = sensor;

    return this.sensorDataRepo.save(sensorData);
  }

  async updateSensorDataById(sensorId: string, partialSensorData: UpdateSensorDataDto) {
    const sensorData = await this.findSensorDataById(partialSensorData.id);
    if (!sensorData) {
      throw new NotFoundException('SensorData not found');
    }
    if (sensorData.sensorId !== sensorId) {
      throw new ConflictException('SensorData does not belong to Sensor');
    }
    Object.assign(sensorData, partialSensorData);

    return this.sensorDataRepo.save(sensorData);
  }

  async removeSensorDataById(sensorId: string, sensorDataId: string) {
    const sensorData = await this.findSensorDataById(sensorDataId);
    if (!sensorData) {
      throw new NotFoundException('SensorData not found');
    }
    if (sensorData.sensorId !== sensorId) {
      throw new ConflictException('SensorData does not belong to Sensor');
    }

    return this.sensorDataRepo.remove(sensorData);
  }
}
