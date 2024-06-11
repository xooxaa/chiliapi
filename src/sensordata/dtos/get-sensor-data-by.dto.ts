import { IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSensorDataByIntervalDto {
  @ApiProperty()
  @IsDate()
  start: Date;

  @ApiProperty()
  @IsDate()
  end: Date;
}
