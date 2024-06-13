import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SensorsService } from '../sensors/sensors.service';

@Injectable()
export class SensorExists implements NestInterceptor {
  constructor(private readonly sensorsService: SensorsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const sensorId = request.params.sensorId;
    await this.sensorsService.findSensorById(sensorId);

    return next.handle();
  }
}
