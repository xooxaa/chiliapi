import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { customRequest, signUpTestUser } from './request.utils';

describe('Stations Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await signUpTestUser(app, 'the@station.user');
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns an empty list if no stations are in the database', async () => {
    await customRequest(app)
      .get(`/stations/`)
      .expect(200)
      .then((res) => {
        expect(res.body.length === 0);
      });
  });

  it('returns 403 when trying to get a non-existent station', async () => {
    const nonExistentStationId = 'non-existent-id';
    const response = await customRequest(app).get(`/stations/${nonExistentStationId}`).expect(404);

    expect(response.body.message).toContain(`Station not found`);
  });

  it('creates a new station', () => {
    return customRequest(app)
      .post('/stations')
      .send({ name: 'Station 1', description: 'My Station 1' })
      .expect(201)
      .then((res) => {
        const { id, name, description, active } = res.body;
        expect(id).toBeDefined();
        expect(name).toEqual('Station 1');
        expect(description).toEqual('My Station 1');
        expect(active).toEqual(true);
      });
  });

  it('retrieves all stations', async () => {
    await customRequest(app).post('/stations').send({ name: 'Station 2', description: 'My Station 2' }).expect(201);

    const response = await customRequest(app).get('/stations').expect(200);

    const stations = response.body;
    expect(stations.length).toBeGreaterThan(0);
    stations.forEach((station) => {
      expect(station).toHaveProperty('id');
      expect(station).toHaveProperty('name');
      expect(station).toHaveProperty('description');
      expect(station).toHaveProperty('active');
    });
  });

  it('updates a station', async () => {
    const stationResponse = await customRequest(app)
      .post('/stations')
      .send({ name: 'Station 3', description: 'My Station 3' })
      .expect(201);

    const stationId = stationResponse.body.id;
    expect(stationId).toBeDefined();

    const updatedStationResponse = await customRequest(app)
      .patch(`/stations/${stationId}`)
      .send({ name: 'Updated Station 3', description: 'My Updated Station 3' })
      .expect(200);

    const { id, name, description, active } = updatedStationResponse.body;
    expect(id).toEqual(stationId);
    expect(name).toEqual('Updated Station 3');
    expect(description).toEqual('My Updated Station 3');
    expect(active).toEqual(true);
  });

  it('deletes a station', async () => {
    const stationResponse = await customRequest(app)
      .post('/stations')
      .send({ name: 'Station 4', description: 'My Station 4' })
      .expect(201);

    const stationId = stationResponse.body.id;
    expect(stationId).toBeDefined();

    await customRequest(app).delete(`/stations/${stationId}`).expect(200);
    await customRequest(app).get(`/stations/${stationId}`).expect(404);
  });

  it('returns 404 when trying to get sensors from a non-existent station', async () => {
    const nonExistentStationId = 'non-existent-id';
    const response = await customRequest(app).get(`/stations/${nonExistentStationId}/sensors`).expect(404);

    expect(response.body.message).toContain(`Station not found`);
  });

  it('retrieves all sensors for a station', async () => {
    const stationResponse = await customRequest(app)
      .post('/stations')
      .send({ name: 'Station 5', description: 'My Station 5' })
      .expect(201);

    const stationId = stationResponse.body.id;
    expect(stationId).toBeDefined();

    const sensor1Response = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Sensor 1', description: '', type: 'temperature', stationId })
      .expect(201);
    const sensor2Response = await customRequest(app)
      .post('/sensors')
      .send({ name: 'Sensor 2', description: '', type: 'humidity', stationId })
      .expect(201);

    const sensor1Id = sensor1Response.body.id;
    const sensor2Id = sensor2Response.body.id;
    expect(sensor1Id).toBeDefined();
    expect(sensor2Id).toBeDefined();

    const response = await customRequest(app).get(`/stations/${stationId}/sensors`).expect(200);

    const sensors = response.body;
    expect(sensors.length).toBe(2);
    sensors.forEach((sensor) => {
      expect(sensor).toHaveProperty('id');
      expect(sensor).toHaveProperty('name');
      expect(sensor).toHaveProperty('type');
      expect(sensor).toHaveProperty('stationId');
      expect(sensor.stationId).toEqual(stationId);
    });
  });
});
