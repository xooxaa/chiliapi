import { Module } from '@nestjs/common';
import { SensordataController } from './sensordata.controller';
import { SensordataService } from './sensordata.service';

@Module({
  controllers: [SensordataController],
  providers: [SensordataService]
})
export class SensordataModule {}
