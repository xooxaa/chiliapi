import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDataDto {
  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rawValue: number;
}
