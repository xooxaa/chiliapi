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

  it('returns an empty list if no sensors are in the database', async () => {
    await request(app.getHttpServer())
      .get(`/sensors/`)
      .expect(200)
      .then((res) => {
        expect(res.body.length === 0);
      });
  });

  it('returns 404 when trying to get a non-existent sensor', async () => {
    const nonExistentSensorId = 'non-existent-id';
    const response = await request(app.getHttpServer()).get(`/sensors/${nonExistentSensorId}`).expect(404);

    expect(response.body.message).toContain(`Sensor not found`);
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

  it('retrieves all sensors of a given type', async () => {
    await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Temperature Sensor 1', type: 'temperature' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Temperature Sensor 2', type: 'temperature' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Humidity Sensor 1', type: 'humidity' })
      .expect(201);

    const response = await request(app.getHttpServer()).get('/sensors/of?type=temperature').expect(200);

    const sensors = response.body;
    expect(sensors.length).toBeGreaterThan(0);
    sensors.forEach((sensor) => {
      expect(sensor.type).toEqual('temperature');
      expect(sensor).toHaveProperty('id');
      expect(sensor).toHaveProperty('name');
      expect(sensor).toHaveProperty('type');
      expect(sensor).toHaveProperty('unit');
      expect(sensor).toHaveProperty('active');
    });
  });

  it('returns 400 when trying to create a sensor with an unsupported type', async () => {
    const unsupportedSensorType = 'unsupported-type';

    const response = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Unsupported Sensor', type: unsupportedSensorType })
      .expect(400);

    expect(response.body.message).toContain(`Invalid sensor type: ${unsupportedSensorType}`);
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

  it('returns 400 when trying to update a sensor to an unsupported type', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/sensors')
      .send({ name: 'Valid Sensor', type: 'temperature' })
      .expect(201);

    const { id: sensorId } = createResponse.body;

    const unsupportedSensorType = 'unsupported-type';
    const updateResponse = await request(app.getHttpServer())
      .patch(`/sensors/${sensorId}`)
      .send({ name: 'Updated Sensor', type: unsupportedSensorType })
      .expect(400);

    expect(updateResponse.body.message).toContain(`Invalid sensor type: ${unsupportedSensorType}`);
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
});
