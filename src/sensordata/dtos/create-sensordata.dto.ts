import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDataDto {
  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rawValue?: number;

  @ApiProperty()
  @IsDateString()
  timestamp: Date;
}
