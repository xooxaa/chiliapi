import { IsString, IsNumber } from 'class-validator';

export class CreateSensorDataDto {
  @IsNumber()
  value: number;

  @IsNumber()
  rawValue: number;
}
