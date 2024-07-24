import { BadRequestException } from '@nestjs/common';

export class SensorTypes {
  constructor(
    public readonly type: string,
    public readonly unitLong: string,
    public readonly unitShort: string,
  ) {}

  static readonly TEMPERATURE = new SensorTypes('temperature', 'Celsius', '°C');
  static readonly HUMIDITY = new SensorTypes('humidity', 'PercentageRH', '%RH');
  static readonly MOISTURE = new SensorTypes('moisture', 'Percentage', '');
  static readonly PRESSURE = new SensorTypes('pressure', 'Pascal', 'hPa');
  static readonly WEIGHT = new SensorTypes('weight', 'gram', 'g');
  static readonly HYDRO = new SensorTypes('hydro', 'pH', 'pH');
  static readonly TDSEC = new SensorTypes('tdsec', 'EC', 'EC');

  static readonly ALL_TYPES = [
    SensorTypes.TEMPERATURE,
    SensorTypes.HUMIDITY,
    SensorTypes.MOISTURE,
    SensorTypes.PRESSURE,
    SensorTypes.WEIGHT,
    SensorTypes.HYDRO,
    SensorTypes.TDSEC,
  ];

  static fromType(type: string): SensorTypes {
    const found = this.ALL_TYPES.find((t) => t.type === type);
    if (!found) {
      throw new BadRequestException(`Invalid sensor type: ${type}`);
    }
    return found;
  }
}
