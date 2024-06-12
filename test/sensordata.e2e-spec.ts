import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('SensorData Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns an empty list if no sensordata was found for a given sensor', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 1', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    const dataResponse = await request(app.getHttpServer()).get(`/sensors/${sensorId}/data`).expect(200);
    expect(dataResponse.body.length).toEqual(0);
  });

  it('returns 404 when attempting to find non-existent sensor data', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 2', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;

    const nonExistentDataId = 'non-existent-id';
    const response = await request(app.getHttpServer())
      .delete(`/sensors/${sensorId}/data/${nonExistentDataId}`)
      .expect(404);

    expect(response.body.message).toContain(`SensorData not found`);
  });

  it('adds and retrieves sensordata', async () => {
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
    expect(dataEntries.length).toBe(1);

    const { value, rawValue, timestamp } = dataEntries[0];
    expect(value).toEqual(101.3);
    expect(rawValue).toEqual(1013);
    expect(new Date(timestamp).toISOString()).toEqual(new Date(timestamp).toISOString());
  });

  it('adds and retrieves the latest sensordata', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 4', type: 'pressure' })
      .expect(201);

    const sensorId = sensorResponse.body.id;

    const firstTimestamp = new Date();
    await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 101.3,
        rawValue: 1013,
        timestamp: firstTimestamp.toISOString(),
      })
      .expect(201);

    const secondTimestamp = new Date(firstTimestamp.getTime() + 1000);
    await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 102.5,
        rawValue: 1025,
        timestamp: secondTimestamp.toISOString(),
      })
      .expect(201);

    const dataResponse = await request(app.getHttpServer()).get(`/sensors/${sensorId}/data`).expect(200);

    const dataEntries = dataResponse.body;
    expect(dataEntries.length).toBe(2);

    const latestDataResponse = await request(app.getHttpServer()).get(`/sensors/${sensorId}/data/latest`).expect(200);

    const latestData = latestDataResponse.body;
    expect(latestData.value).toEqual(102.5);
    expect(latestData.rawValue).toEqual(1025);
    expect(new Date(latestData.timestamp).toISOString()).toEqual(secondTimestamp.toISOString());
  });

  it('adds and retrieves sensordata within a given interval', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 5', type: 'humidity' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    const now = new Date();
    const past = new Date(now.getTime() - 60 * 60 * 1000);
    const future = new Date(now.getTime() + 60 * 60 * 1000);
    await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 95.0,
        rawValue: 950,
        timestamp: past.toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 85.0,
        rawValue: 850,
        timestamp: now.toISOString(),
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 75.0,
        rawValue: 750,
        timestamp: future.toISOString(),
      })
      .expect(201);

    const start = new Date(now.getTime() - 30 * 60 * 1000).toISOString();
    const end = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    const dataResponseStartEnd = await request(app.getHttpServer())
      .get(`/sensors/${sensorId}/data`)
      .query({ start, end })
      .expect(200);

    const dataResponseStart = await request(app.getHttpServer())
      .get(`/sensors/${sensorId}/data`)
      .query({ start })
      .expect(200);

    const dataResponseEnd = await request(app.getHttpServer())
      .get(`/sensors/${sensorId}/data`)
      .query({ end })
      .expect(200);

    expect(dataResponseStartEnd.body.length).toBe(1);
    expect(dataResponseStart.body.length).toBe(2);
    expect(dataResponseEnd.body.length).toBe(2);
  });

  it('updates sensordata', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 6', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    const dataResponse = await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 22,
        timestamp: new Date().toISOString(),
      })
      .expect(201);

    const dataId = dataResponse.body.id;

    const updatedValue = 23.0;
    const updatedRawValue = 5135;
    const updatedTimestamp = new Date().toISOString();

    await request(app.getHttpServer())
      .patch(`/sensors/${sensorId}/data`)
      .send({
        id: dataId,
        value: updatedValue,
        rawValue: updatedRawValue,
        timestamp: updatedTimestamp,
      })
      .expect(200);

    const updatedDataResponse = await request(app.getHttpServer()).get(`/sensors/${sensorId}/data`).expect(200);

    const updatedDataEntries = updatedDataResponse.body;
    const updatedData = updatedDataEntries.find((entry) => entry.id === dataId);

    expect(updatedData).toBeDefined();
    expect(updatedData.value).toEqual(updatedValue);
    expect(updatedData.rawValue).toEqual(updatedRawValue);
    expect(new Date(updatedData.timestamp).toISOString()).toEqual(new Date(updatedTimestamp).toISOString());
  });

  it('deletes sensordata', async () => {
    const sensorResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 7', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;

    const dataResponse = await request(app.getHttpServer())
      .post(`/sensors/${sensorId}/data`)
      .send({
        value: 25.0,
        rawValue: 250,
        timestamp: new Date().toISOString(),
      })
      .expect(201);

    const dataId = dataResponse.body.id;

    await request(app.getHttpServer()).delete(`/sensors/${sensorId}/data/${dataId}`).expect(200);

    await request(app.getHttpServer()).delete(`/sensors/${sensorId}/data/${dataId}`).expect(404);
  });

  it('returns 409 when attempting to update or delete sensor data for the wrong sensor', async () => {
    const sensorResponse1 = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 8', type: 'temperature' })
      .expect(201);

    const sensorResponse2 = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Sensor 9', type: 'humidity' })
      .expect(201);

    const sensorId1 = sensorResponse1.body.id;
    const sensorId2 = sensorResponse2.body.id;

    const dataResponse = await request(app.getHttpServer())
      .post(`/sensors/${sensorId1}/data`)
      .send({
        value: 25.0,
        rawValue: 250,
        timestamp: new Date().toISOString(),
      })
      .expect(201);

    const dataId = dataResponse.body.id;

    await request(app.getHttpServer())
      .patch(`/sensors/${sensorId2}/data`)
      .send({
        id: dataId,
        value: 30.0,
        rawValue: 300,
        timestamp: new Date().toISOString(),
      })
      .expect(409);

    await request(app.getHttpServer()).delete(`/sensors/${sensorId2}/data/${dataId}`).expect(409);
  });
});
