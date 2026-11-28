const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /energia', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('calcula trabalho', async () => {
    const payload = { F: 20, d: 5, angulo: 30 };
    const res = await request(app).post('/energia/trabalho').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    const numeric = Number(res.body.data.resultado.split('=').pop().trim());
    expect(numeric).toBeCloseTo(86.60254, 4);
  });

  test('calcula energia cinetica', async () => {
    const payload = { m: 4, v: 10 };
    const res = await request(app).post('/energia/cinetica').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*200$/);
  });

  test('calcula energia potencial gravitacional', async () => {
    const payload = { m: 2, h: 10 };
    const res = await request(app).post('/energia/potencial-gravitacional').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    const numeric = Number(res.body.data.resultado.split('=').pop().trim());
    expect(numeric).toBeCloseTo(196.2, 4);
  });

  test('calcula potencial elastica', async () => {
    const payload = { k: 50, x: 0.3 };
    const res = await request(app).post('/energia/potencial-elastica').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*2\.25$/);
  });

  test('calcula potencia', async () => {
    const payload = { T: 500, s0: 2, sf: 7 };
    const res = await request(app).post('/energia/potencia').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*100$/);
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/energia/trabalho').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
