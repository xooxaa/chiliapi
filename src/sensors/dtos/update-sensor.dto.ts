import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSensorDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;
}
