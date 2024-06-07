import { Expose } from 'class-transformer';

export class SensorDataDto {
  @Expose()
  id: number;

  @Expose()
  value: number;

  @Expose()
  rawValue: number;
}
