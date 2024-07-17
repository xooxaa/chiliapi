import { IsNumber, IsOptional, IsString, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, minimum: -90, maximum: 90 })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ required: false, minimum: -180, maximum: 180 })
  @IsOptional()
  @IsLongitude()
  longitude?: number;
}
