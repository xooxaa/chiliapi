import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../interceptors/serialize.interceptor';
import { StationsService } from './stations.service';
import { StationDto } from './dtos/station.dto';

@ApiTags('sensors')
@Controller('stations')
@Serialize(StationDto)
export class StationsController {
  constructor(private sensorsService: StationsService) {}
}
