import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SensorDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  active: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  stationId: string;

  @ApiProperty()
  @Expose()
  userId: string;
}
