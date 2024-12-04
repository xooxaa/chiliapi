import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { customRequest, signUpTestUser } from './request.utils';

describe('Sensors Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await signUpTestUser(app, 'the@sensor.user');
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns an empty list if no sensors are in the database', async () => {
    await customRequest(app)
      .get(`/sensors/`)
      .expect(200)
      .then((res) => {
        expect(res.body.length === 0);
      });
  });

  it('returns 404 when trying to get a non-existent sensor', async () => {
    const nonExistentSensorId = 'non-existent-id';
    const response = await customRequest(app).get(`/sensors/${nonExistentSensorId}`).expect(404);

    expect(response.body.message).toContain(`Sensor not found`);
  });

  it('creates a new sensor', () => {
    return customRequest(app)
      .post('/sensors')
      .send({ name: 'Sensor 1', description: '', type: 'temperature' })
      .expect(201)
      .then((res) => {
        const { id, name, type, active } = res.body;
        expect(id).toBeDefined();
        expect(name).toEqual('Sensor 1');
        expect(type).toEqual('temperature');
        expect(active).toEqual(true);
      });
  });

  it('retrieves a sensors by id', async () => {
    const sensorResponse = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Sensor 2', description: '', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    const requestURL = `/sensors/${sensorId}`;
    const response = await customRequest(app).get(requestURL).expect(200);

    const sensor = response.body;
    expect(sensor).toHaveProperty('id');
    expect(sensor).toHaveProperty('name');
    expect(sensor).toHaveProperty('type');
    expect(sensor).toHaveProperty('active');
  });

  it('retrieves all sensors', async () => {
    await customRequest(app).post('/sensors').send({ name: 'Sensor 3', description: '', type: 'humidity' }).expect(201);

    const response = await customRequest(app).get('/sensors').expect(200);

    const sensors = response.body;
    expect(sensors.length).toBeGreaterThan(0);
    sensors.forEach((sensor) => {
      expect(sensor).toHaveProperty('id');
      expect(sensor).toHaveProperty('name');
      expect(sensor).toHaveProperty('type');
      expect(sensor).toHaveProperty('active');
    });
  });

  it('retrieves all sensors of a given type', async () => {
    await customRequest(app)
      .post('/sensors')
      .send({ name: 'Temperature Sensor 1', description: '', type: 'temperature' })
      .expect(201);

    await customRequest(app)
      .post('/sensors')
      .send({ name: 'Temperature Sensor 2', description: '', type: 'temperature' })
      .expect(201);

    await customRequest(app)
      .post('/sensors')
      .send({ name: 'Humidity Sensor 1', description: '', type: 'humidity' })
      .expect(201);

    const response = await customRequest(app).get('/sensors?type=temperature').expect(200);

    const sensors = response.body;
    expect(sensors.length).toBeGreaterThan(0);
    sensors.forEach((sensor) => {
      expect(sensor.type).toEqual('temperature');
      expect(sensor).toHaveProperty('id');
      expect(sensor).toHaveProperty('name');
      expect(sensor).toHaveProperty('type');
      expect(sensor).toHaveProperty('active');
    });
  });

  it('returns 400 when trying to create a sensor with an unsupported type', async () => {
    const unsupportedSensorType = 'unsupported-type';

    const response = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Unsupported Sensor', type: unsupportedSensorType })
      .expect(400);

    expect(response.body.message).toContain(`Invalid sensor type: ${unsupportedSensorType}`);
  });

  it('updates a sensor', async () => {
    const sensorResponse = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Sensor 4', description: '', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    expect(sensorId).toBeDefined();

    const updatedSensorResponse = await customRequest(app)
      .patch(`/sensors/${sensorId}`)
      .send({ name: 'Updated Sensor 4', type: 'temperature' })
      .expect(200);

    const { id, name: updatedName, type: updatedType, active: updatedActive } = updatedSensorResponse.body;
    expect(id).toEqual(sensorId);
    expect(updatedName).toEqual('Updated Sensor 4');
    expect(updatedType).toEqual('temperature');
    expect(updatedActive).toEqual(true);
  });

  it('returns 400 when trying to update a sensor to an unsupported type', async () => {
    const createResponse = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Valid Sensor', description: '', type: 'temperature' })
      .expect(201);

    const { id: sensorId } = createResponse.body;

    const unsupportedSensorType = 'unsupported-type';
    const updateResponse = await customRequest(app)
      .patch(`/sensors/${sensorId}`)
      .send({ name: 'Updated Sensor', type: unsupportedSensorType })
      .expect(400);

    expect(updateResponse.body.message).toContain(`Invalid sensor type: ${unsupportedSensorType}`);
  });

  it('deletes a sensor', async () => {
    const sensorResponse = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Sensor 5', description: '', type: 'humidity' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    expect(sensorId).toBeDefined();

    await customRequest(app).delete(`/sensors/${sensorId}`).expect(200);
    await customRequest(app).get(`/sensors/${sensorId}`).expect(404);
  });

  it('fails to update a sensor from another user', async () => {
    const sensorResponse = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Sensor 6', description: '', type: 'temperature' })
      .expect(201);

    const sensorId = sensorResponse.body.id;
    expect(sensorId).toBeDefined();

    await signUpTestUser(app, 'theother@sensor.user');

    await customRequest(app)
      .patch(`/sensors/${sensorId}`)
      .send({ name: 'Updated Sensor 6', type: 'temperature' })
      .expect(403);
  });
});
