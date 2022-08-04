import request from 'supertest';
import { app } from '../../src/app';
import {
  initDb,
  closeDb,
  resetDb,
} from './db';

beforeAll(async () => {
  await initDb();
});
afterAll(async () => {
  await closeDb();
});

describe('Hello world', () => {
  it('returns a simple hello response', async () => {
    const resp = await request(app).get('/hello_world');
    expect(resp.status).toBe(200);
    expect(resp.body.data.message).toBe('Hello World!');
  });
});

describe('Errors', () => {
  it('returns a 404 error for non-existent pages', async () => {
    const resp = await request(app).get('/does_not_exist');
    expect(resp.status).toBe(404);
    expect(resp.body.errors).toHaveLength(1);
    expect(resp.body.errors[0].status).toBe(404);
  });

  it('returns a sanitised error when things go wrong internally', async () => {
    const resp = await request(app).get('/hello_world/internal_error');
    expect(resp.status).toBe(500);
    expect(resp.body.errors).toHaveLength(1);
    expect(resp.body.errors[0].status).toBe(500);
  });

  it('returns a standard errors when they are thrown up', async () => {
    const resp = await request(app).get('/hello_world/custom_error');
    expect(resp.status).toBe(400);
    expect(resp.body.errors).toHaveLength(1);
    expect(resp.body.errors[0].status).toBe(400);
  });
});

describe('Greetings', () => {
  const testState = {
    createdData: {} as any,
  };

  beforeAll(async () => { await resetDb(); });

  it('returns an empty list before anything is created', async () => {
    const resp = await request(app).get('/hello_world/greetings');
    expect(resp.status).toBe(200);
    expect(resp.body.data.length).toBe(0);
    expect(resp.body.links.self).toMatch('greetings?offset=0');
    expect(resp.body.links.next).toMatch('greetings?offset=20');
  });

  it('throws an error when you request a badly formatted uuid', async () => {
    const badId = '123';
    const resp = await request(app)
      .get(`/hello_world/greetings/${badId}`);
    expect(resp.status).toBe(400);
  });

  it('throws a 404 when you request a non-existent greeting', async () => {
    const id = 'c82c8f20-a3b1-44a4-a3aa-780ef826f003';
    const resp = await request(app)
      .get(`/hello_world/greetings/${id}`);
    expect(resp.status).toBe(404);
  });

  it('throws an error when the post body is invalid', async () => {
    // No name
    let resp = await request(app)
      .post('/hello_world/greetings')
      .send({ age: 10 });
    expect(resp.status).toBe(400);

    // Name is not less than 50 characters
    resp = await request(app)
      .post('/hello_world/greetings')
      .send({ name: 'a'.repeat(51) });
    expect(resp.status).toBe(400);

    // Name is not defined
    resp = await request(app)
      .post('/hello_world/greetings')
      .send({ name: null });
    expect(resp.status).toBe(400);
  });

  it('allows you to create a new greeting', async () => {
    const resp = await request(app)
      .post('/hello_world/greetings')
      .send({ name: 'test' });

    expect(resp.status).toBe(200);
    expect(resp.body.data.id).toBeTruthy();
    expect(resp.body.data.type).toBe('Greetings');
    expect(resp.body.data.attributes.name).toBe('test');
    expect(resp.body.data.attributes.message).toBe('Hello test!');

    testState.createdData = resp.body.data;
  });

  it('allows you to fetch a previously created greeting', async () => {
    const resp = await request(app)
      .get(`/hello_world/greetings/${testState.createdData.id}`);

    expect(resp.status).toBe(200);
    expect(resp.body.data).toEqual(testState.createdData);
  });
});
