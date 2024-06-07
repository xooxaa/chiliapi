export class SensorTypeInfo {
  constructor(
    public readonly type: string,
    public readonly unit: string,
  ) {}

  static readonly TEMPERATURE = new SensorTypeInfo('temperature', 'Celsius');
  static readonly HUMIDITY = new SensorTypeInfo('humidity', 'Percentage');
  static readonly PRESSURE = new SensorTypeInfo('pressure', 'Pascal');

  static readonly ALL_TYPES = [
    SensorTypeInfo.TEMPERATURE,
    SensorTypeInfo.HUMIDITY,
    SensorTypeInfo.PRESSURE,
  ];

  static fromType(type: string): SensorTypeInfo {
    const found = this.ALL_TYPES.find((t) => t.type === type);
    if (!found) {
      throw new Error(`Invalid sensor type: ${type}`);
    }
    return found;
  }
}
