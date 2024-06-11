import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// function nodeEnvIsTest() {
//   return process.env.NODE_ENV === 'test' ? true : false;
// }

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: this.configService.get<string>('DB_NAME'),
      synchronize: true,
      autoLoadEntities: true,
      migrationsRun: false,
      keepConnectionAlive: false,
    };
  }
}
