import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SensorsService } from '../sensors/sensors.service';

@Injectable()
export class SensorBelongsToUser implements NestInterceptor {
  constructor(private readonly sensorsService: SensorsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const sensorId = request.params.sensorId;
    const userId = request.CurrentUser.id;

    const sensor = await this.sensorsService.findSensorById(sensorId);
    if (sensor.userId !== userId) {
      throw new ForbiddenException('User is not the owner of that sensor');
    }

    return next.handle();
  }
}
