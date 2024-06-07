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
  type: string;

  @ApiProperty()
  @Expose()
  unit: string;

  @ApiProperty()
  @Expose()
  active: boolean;
}
