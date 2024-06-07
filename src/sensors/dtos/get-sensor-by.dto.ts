import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSensorByTypeDto {
  @ApiProperty()
  @IsString()
  type: string;
}
