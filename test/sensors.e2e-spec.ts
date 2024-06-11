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

  it('retrieves all sensors', async () => {
    await request(app.getHttpServer()).post('/sensors').send({ name: 'Sensor 2', type: 'humidity' }).expect(201);

    const response = await request(app.getHttpServer()).get('/sensors').expect(200);

    const sensors = response.body;
    expect(sensors.length).toBeGreaterThan(0);
    sensors.forEach((sensor) => {
      expect(sensor).toHaveProperty('id');
      expect(sensor).toHaveProperty('name');
      expect(sensor).toHaveProperty('type');
      expect(sensor).toHaveProperty('unit');
      expect(sensor).toHaveProperty('active');
    });
  });

  it('updates a sensor', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 4', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    expect(sensorId).toBeDefined();

    const updatedSensorResponse = await request(app.getHttpServer())
      .patch(`/sensors/${sensorId}`)
      .send({ name: 'Updated Sensor 4', type: 'temperature' })
      .expect(200);

    const {
      id,
      name: updatedName,
      type: updatedType,
      unit: updatedUnit,
      active: updatedActive,
    } = updatedSensorResponse.body;
    expect(id).toEqual(sensorId);
    expect(updatedName).toEqual('Updated Sensor 4');
    expect(updatedType).toEqual('temperature');
    expect(updatedUnit).toEqual('Celsius');
    expect(updatedActive).toEqual(true);
  });

  it('deletes a sensor', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 5', type: 'humidity' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    expect(sensorId).toBeDefined();

    await request(app.getHttpServer()).delete(`/sensors/${sensorId}`).expect(200);

    await request(app.getHttpServer()).get(`/sensors/${sensorId}`).expect(404);
  });

  it('adds and retrieves sensor data', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 3', type: 'pressure' })
      .expect(201);

    const sensorId = sensorResponse.body.id;

    await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 101.3,
        rawValue: 1013,
        timestamp: new Date().toISOString(),
      })
      .expect(201);

    const dataResponse = await request(app.getHttpServer()).get(`/sensors/${sensorId}/data`).expect(200);

    const dataEntries = dataResponse.body;
    expect(dataEntries.length).toBeGreaterThan(0);

    const { value, rawValue, timestamp } = dataEntries[0];
    expect(value).toEqual(101.3);
    expect(rawValue).toEqual(1013);
    expect(new Date(timestamp).toISOString()).toEqual(new Date(timestamp).toISOString());
  });
});
