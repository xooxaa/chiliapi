import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './stations.entity';
import { CreateStationDto } from './dtos/create-station.dto';
import { UpdateStationDto } from './dtos/update-station.dto';
import { User } from '../users/users.entity';

@Injectable()
export class StationsService {
  constructor(@InjectRepository(Station) private readonly stationRepo: Repository<Station>) {}

  async findAllStations() {
    return await this.stationRepo.find({ relations: { sensors: true } });
  }

  async findStationById(stationId: string) {
    const station = await this.stationRepo.findOneBy({ id: stationId });
    if (!station) {
      throw new NotFoundException('Station not found');
    }

    return station;
  }

  async findSensorsByStationId(stationId: string) {
    const station = await this.stationRepo.findOne({
      where: { id: stationId },
      relations: ['sensors'],
    });
    if (!station) {
      throw new NotFoundException('Station not found');
    }

    return station.sensors;
  }

  async createStation(createStationDto: CreateStationDto, user: User) {
    const station = this.stationRepo.create(createStationDto);
    station.userId = user.id;

    return this.stationRepo.save(station);
  }

  async updateStationById(stationId: string, updateStationDto: UpdateStationDto, user: User) {
    const station = await this.findStationById(stationId);
    Object.assign(station, updateStationDto);

    return this.stationRepo.save(station);
  }

  async removeStationById(stationId: string, user: User) {
    const station = await this.findStationById(stationId);

    return this.stationRepo.remove(station);
  }
}
