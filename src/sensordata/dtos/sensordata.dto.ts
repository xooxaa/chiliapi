import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SensorDataDto {
  @ApiProperty()
  @Expose()
  id: string;

  @Expose()
  @ApiProperty()
  value: number;

  @Expose()
  @ApiProperty()
  rawValue: number;
}
