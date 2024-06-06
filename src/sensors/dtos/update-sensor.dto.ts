import { IsString } from 'class-validator';

export class UpdateSensorDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}
