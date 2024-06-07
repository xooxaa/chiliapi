export class SensorTypes {
  constructor(
    public readonly type: string,
    public readonly unit: string,
  ) {}

  static readonly TEMPERATURE = new SensorTypes('temperature', 'Celsius');
  static readonly HUMIDITY = new SensorTypes('humidity', 'Percentage');
  static readonly PRESSURE = new SensorTypes('pressure', 'Pascal');

  static readonly ALL_TYPES = [SensorTypes.TEMPERATURE, SensorTypes.HUMIDITY, SensorTypes.PRESSURE];

  static fromType(type: string): SensorTypes {
    const found = this.ALL_TYPES.find((t) => t.type === type);
    if (!found) {
      throw new Error(`Invalid sensor type: ${type}`);
    }
    return found;
  }
}
