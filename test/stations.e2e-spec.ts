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

  it('returns an empty list if no stations are in the database', async () => {
    await request(app.getHttpServer())
      .get(`/stations/`)
      .expect(200)
      .then((res) => {
        expect(res.body.length === 0);
      });
  });
});
