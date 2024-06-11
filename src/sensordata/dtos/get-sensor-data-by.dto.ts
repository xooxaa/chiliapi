import { IsDate, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSensorDataByIntervalDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  start?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end?: Date;
}
