import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SensorDto } from 'src/sensors/dtos/sensor.dto';

export class StationDto {
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
  latitude: number;

  @ApiProperty()
  @Expose()
  longitude: number;

  @ApiProperty()
  @Expose()
  active: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  sensors: SensorDto[];
}
