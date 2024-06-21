import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

function nodeEnvIsTest() {
  return process.env.NODE_ENV === 'test' ? true : false;
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbType = this.configService.get<string>('DB_TYPE');

    if (dbType === 'postgres') {
      return {
        type: 'postgres',
        host: this.configService.get<string>('DB_HOST'),
        port: this.configService.get<number>('DB_PORT'),
        username: this.configService.get<string>('DB_USERNAME'),
        password: 'abcd',
        database: this.configService.get<string>('DB_DATABASE'),
        synchronize: false,
        autoLoadEntities: true,
        migrationsRun: true,
        keepConnectionAlive: true,
      };
    } else if (dbType === 'sqlite') {
      return {
        type: 'sqlite',
        database: this.configService.get<string>('DB_DATABASE'),
        synchronize: nodeEnvIsTest(),
        autoLoadEntities: true,
        migrationsRun: !nodeEnvIsTest(),
        keepConnectionAlive: false,
      };
    } else {
      throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }
  }
}
