import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensordataController } from './sensordata.controller';
import { SensordataService } from './sensordata.service';
import { SensorData } from './sensordata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData])],
  controllers: [SensordataController],
  providers: [SensordataService],
})
export class SensordataModule {}
