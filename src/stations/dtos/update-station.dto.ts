import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, minimum: -90, maximum: 90 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, minimum: -180, maximum: 180 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
