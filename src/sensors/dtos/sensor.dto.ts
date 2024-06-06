import { Expose } from 'class-transformer';

export class SensorDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  active: boolean;

  @Expose()
  unit: string;
}
