import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSensorDataDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rawValue: number;
}
