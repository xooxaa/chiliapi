import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';

@Module({
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class SensorsModule {}
