import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../sensors/sensors.entity';
import { SensorData } from './sensordata.entity';
import { CreateSensorDataDto } from './dtos/create-sensordata.dto';
import { UpdateSensorDataDto } from './dtos/update-sensordata.dto';
import { GetSensorDataByIntervalDto } from './dtos/get-sensor-data-by.dto';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepo: Repository<SensorData>,
  ) {}

  async findAllSensorDataInInterval(sensorId: string, interval: GetSensorDataByIntervalDto) {
    const { start, end } = interval;

    const queryBuilder = this.sensorDataRepo
      .createQueryBuilder('sensorData')
      .where('sensorId = :sensorId', { sensorId });

    if (start && end) {
      queryBuilder.andWhere('sensorData.timestamp BETWEEN :start AND :end', { start, end });
    } else if (start) {
      queryBuilder.andWhere('sensorData.timestamp >= :start', { start });
    } else if (end) {
      queryBuilder.andWhere('sensorData.timestamp <= :end', { end });
    }

    return queryBuilder.orderBy('sensorData.timestamp', 'ASC').getMany();
  }

  async findLatestSensorData(sensorId: string) {
    return this.sensorDataRepo
      .createQueryBuilder('sensorData')
      .where('sensorId = :sensorId', { sensorId })
      .orderBy('sensorData.timestamp', 'DESC')
      .getOne();
  }

  async findSensorDataById(sensorDataId: string) {
    const sensorData = await this.sensorDataRepo.findOneBy({ id: sensorDataId });
    console.log(sensorData);

    if (!sensorData) {
      throw new NotFoundException('SensorData not found');
    }

    return sensorData;
  }

  async createSensorData(sensor: Sensor, createSensorDataDto: CreateSensorDataDto) {
    const sensorData = this.sensorDataRepo.create(createSensorDataDto);
    sensorData.sensor = sensor;
    console.log(sensorData);

    return this.sensorDataRepo.save(sensorData);
  }

  async updateSensorDataById(sensorId: string, partialSensorData: UpdateSensorDataDto) {
    const sensorData = await this.getSensorDataAndCheckSensorId(partialSensorData.id, sensorId);
    Object.assign(sensorData, partialSensorData);

    return this.sensorDataRepo.save(sensorData);
  }

  async removeSensorDataById(sensorId: string, sensorDataId: string) {
    const sensorData = await this.getSensorDataAndCheckSensorId(sensorDataId, sensorId);

    return this.sensorDataRepo.remove(sensorData);
  }

  private async getSensorDataAndCheckSensorId(sensorDataId: string, sensorId: string) {
    const sensorData = await this.findSensorDataById(sensorDataId);
    if (sensorData.sensorId !== sensorId) {
      throw new ConflictException('SensorData does not belong to Sensor');
    }

    return sensorData;
  }
}
