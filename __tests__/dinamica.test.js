const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /dinamica', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('calcula forca resultante', async () => {
    const payload = { m: 30, a: 10 };
    const res = await request(app).post('/dinamica/forca-resultante').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*300$/);
  });

  test('calcula peso', async () => {
    const payload = { m: 10 };
    const res = await request(app).post('/dinamica/peso').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    const numeric = Number(res.body.data.resultado.split('=').pop().trim());
    expect(numeric).toBeCloseTo(98.1, 4);
  });

  test('calcula forca atrito', async () => {
    const payload = { mu: 15, N: 12 };
    const res = await request(app).post('/dinamica/forca-atrito').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*180$/);
  });

  test('calcula forca elastica', async () => {
    const payload = { k: 20, x: 75 };
    const res = await request(app).post('/dinamica/forca-elastica').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*1500$/);
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/dinamica/forca-resultante').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
