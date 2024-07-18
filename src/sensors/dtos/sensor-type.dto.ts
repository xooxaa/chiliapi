import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SensorTypeDto {
  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  unitLong: string;

  @ApiProperty()
  @Expose()
  unitShort: string;
}
