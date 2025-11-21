const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /financeiro', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('calcula variacao pela porcentagem', async () => {
    const payload = { p: 30, v: 10 };
    const res = await request(app).post('/financeiro/variacao').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'grauspararadianos');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(0.3);
  });

  test('calcula variacao percentual', async () => {
    const payload = { vi: 25, vf: 28 };
    const res = await request(app).post('/financeiro/variacao-percentual').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(12);
  });

  test('calcula juros simples', async () => {
    const payload = { c: 1200, i: 0.02, n:15 };
    const res = await request(app).post('/financeiro/juros/simples').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(360);
  });

  test('calcula juros compostos', async () => {
    const payload = { c:5000, i: 0.01, t:6 };
    const res = await request(app).post('/financeiro/juros/compostos').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBeCloseTo(5307.6, 6);
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/financeiro/variacao').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
