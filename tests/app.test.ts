import { SignJWT } from 'jose';
import request from 'supertest';

import { env } from '../src/config/env.config.js';
import { createApp } from '../src/app.js';

const app = createApp();

type ApiBody = {
  data: {
    user?: unknown;
    users?: unknown;
  };
};

describe('app', () => {
  it('returns health details with the provided correlation id', async () => {
    const response = await request(app)
      .get('/health')
      .set('x-correlation-id', 'test-correlation-id')
      .expect(200);

    expect(response.headers['x-correlation-id']).toBe('test-correlation-id');
    expect(response.body).toMatchObject({
      status: 'ok',
      correlationId: 'test-correlation-id',
      environment: 'test',
    });
  });

  it('lists seeded users', async () => {
    const response = await request(app).get('/api/v1/users').expect(200);

    const body = response.body as ApiBody;

    expect(body.data.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'ada@example.com',
          name: 'Ada Lovelace',
        }),
      ]),
    );
  });

  it('validates request bodies before reaching controllers', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ email: 'not-an-email', name: '' })
      .expect(400);

    expect(response.body).toMatchObject({
      status: 'fail',
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed.',
    });
  });

  it('creates users through the service boundary', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({ email: 'Grace@Example.com', name: 'Grace Hopper' })
      .expect(201);

    const body = response.body as ApiBody;

    expect(body.data.user).toMatchObject({
      email: 'grace@example.com',
      name: 'Grace Hopper',
    });
  });

  it('guards authenticated routes', async () => {
    await request(app).get('/api/v1/users/me').expect(401);
  });

  it('accepts valid bearer tokens on authenticated routes', async () => {
    const token = await new SignJWT({
      email: 'ada@example.com',
      roles: ['admin'],
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('9ab967c7-f7f2-4ec5-929c-0d7d3a8d9b6c')
      .setIssuedAt()
      .setExpirationTime('2m')
      .sign(new TextEncoder().encode(env.JWT_SECRET));

    const response = await request(app)
      .get('/api/v1/users/me')
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    const body = response.body as ApiBody;

    expect(body.data.user).toMatchObject({
      email: 'ada@example.com',
      id: '9ab967c7-f7f2-4ec5-929c-0d7d3a8d9b6c',
      roles: ['admin'],
    });
  });
});
