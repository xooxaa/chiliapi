import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

let cookie: string[] = null;

const customRequest = (app: INestApplication) => {
  const server = request(app.getHttpServer());
  return {
    get: (url: string) => server.get(url).set('Cookie', cookie),
    post: (url: string) => server.post(url).set('Cookie', cookie),
    put: (url: string) => server.put(url).set('Cookie', cookie),
    patch: (url: string) => server.patch(url).set('Cookie', cookie),
    delete: (url: string) => server.delete(url).set('Cookie', cookie),
  };
};

const signUpTestUser = async (app: INestApplication, email: string) => {
  const userResponse = await request(app.getHttpServer())
    .put('/auth/signup')
    .send({ name: 'Test User', email, password: 'p9ghg4/D§F&/54gbG§$dgbT$%' })
    .expect(200);

  cookie = userResponse.get('Set-Cookie');
};

export { customRequest, signUpTestUser };
