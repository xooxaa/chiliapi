import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Sensors Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('creates a new sensor', () => {
    return request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 1', type: 'temperature' })
      .expect(201)
      .then((res) => {
        const { id, name, type, unit, active } = res.body;
        expect(id).toBeDefined();
        expect(name).toEqual('Sensor 1');
        expect(type).toEqual('temperature');
        expect(unit).toEqual('Celsius');
        expect(active).toEqual(true);
      });
  });
});
