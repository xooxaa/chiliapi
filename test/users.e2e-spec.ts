import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('signs up a new user', async () => {
    await request(app.getHttpServer())
      .put(`/auth/signup`)
      .send({ email: 'one@some.user', password: 'hfg7#ÄL3fngfh487(Rgfd347T&/D§F&/F' })
      .expect(200)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual('one@some.user');
      });
  });

  it('returns a 400 when trying to register with an email already in use', async () => {
    await request(app.getHttpServer())
      .put(`/auth/signup`)
      .send({ email: 'one@some.user', password: 'hfg7#ÄL3fngfh487(Rgfd347T&/D§F&/F' })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain(`Email already in use`);
      });
  });

  it('signs in an existing user user', async () => {
    await request(app.getHttpServer())
      .post(`/auth/signin`)
      .send({ email: 'one@some.user', password: 'hfg7#ÄL3fngfh487(Rgfd347T&/D§F&/F' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual('one@some.user');
      });
  });

  it('returns a 400 when trying to signin with the wrong password', async () => {
    await request(app.getHttpServer())
      .post(`/auth/signin`)
      .send({ email: 'one@some.user', password: 'hfg7#ÄL3fngfh487(Rgfd347T&/D§F&/' })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain(`Bad credentials`);
      });
  });

  it('returns a 400 when trying to signin a non existant user', async () => {
    await request(app.getHttpServer())
      .post(`/auth/signin`)
      .send({ email: 'defenetly@nota.user', password: 'ggjhnh98t4389h9gh894e' })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toContain(`Bad credentials`);
      });
  });

  it('signs out the current user', async () => {
    await request(app.getHttpServer())
      .post(`/auth/signout`)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({});
      });
  });

  it('gets a user by id', async () => {
    const userResponse = await request(app.getHttpServer())
      .put('/auth/signup')
      .send({ email: 'two@some.user', password: 'p9gtB§P$%T$54gbG§$dgbT$%' })
      .expect(200);

    const userId = userResponse.body.id;
    expect(userId).toBeDefined();

    const cookie = userResponse.get('Set-Cookie');

    await request(app.getHttpServer())
      .get(`/auth/${userId}`)
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toEqual(userId);
        expect(email).toEqual('two@some.user');
      });
  });

  it('returns a 404 if a user cannot be found by id', async () => {
    const userResponse = await request(app.getHttpServer())
      .put('/auth/signup')
      .send({ email: 'seven@some.user', password: 'p9gtB§P$%T$54gbG§$dgbT$%' })
      .expect(200);

    const cookie = userResponse.get('Set-Cookie');
    const nonExistentUserId = 'non-existent-id';

    await request(app.getHttpServer())
      .get(`/auth/${nonExistentUserId}`)
      .set('Cookie', cookie)
      .expect(404)
      .then((res) => {
        expect(res.body.message).toContain(`User not found`);
      });
  });

  it('updates a user', async () => {
    const userResponse = await request(app.getHttpServer())
      .put('/auth/signup')
      .send({ email: 'three@some.user', password: 'jw3r§DADhtg4§goj(%$GHT/§$' })
      .expect(200);

    const userId = userResponse.body.id;
    expect(userId).toBeDefined();

    const updatedUserResponse = await request(app.getHttpServer())
      .patch(`/auth/${userId}`)
      .send({ email: 'three@some.user', password: 'hht9grej57w3HFÖ_hfu34/D' })
      .expect(200);

    const { id, email } = updatedUserResponse.body;
    expect(id).toEqual(userId);
    expect(email).toEqual('three@some.user');
  });

  it('deletes a user', async () => {
    const userResponse = await request(app.getHttpServer())
      .put('/auth/signup')
      .send({ email: 'four@some.user', password: 'gtjg8953HFJ())43tü49' })
      .expect(200);

    const userId = userResponse.body.id;
    expect(userId).toBeDefined();

    await request(app.getHttpServer()).delete(`/auth/${userId}`).expect(200);
    await request(app.getHttpServer()).get(`/auth/${userId}`).expect(403);
  });
});
