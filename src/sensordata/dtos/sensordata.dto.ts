import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SensorDataDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  value: number;

  @ApiProperty()
  @Expose()
  rawValue: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
