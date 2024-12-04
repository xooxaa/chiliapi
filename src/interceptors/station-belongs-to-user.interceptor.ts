import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StationsService } from '../stations/stations.service';

@Injectable()
export class StationBelongsToUser implements NestInterceptor {
  constructor(private readonly stationsService: StationsService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const stationId = request.params.stationId;
    const userId = request.CurrentUser.id;

    const station = await this.stationsService.findStationById(stationId);
    if (station.userId !== userId) {
      throw new ForbiddenException('User is not the owner of that station');
    }

    return next.handle();
  }
}
