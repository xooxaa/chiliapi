import { Expose } from 'class-transformer';

export class SensorDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  unit: string;

  @Expose()
  active: boolean;
}
