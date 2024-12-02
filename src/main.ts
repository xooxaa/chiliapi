import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ChiliPi API')
    .setDescription('Setup Stations and manage their Sensors and Data')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    // origin: 'https://growdu.de',
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
