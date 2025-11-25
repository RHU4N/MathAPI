const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /cinetica', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('velocidadeMedia', async () => {
    const payload = { s0: 0, sf: 100, t0: 0, tf: 10 };
    const res = await request(app).post('/velocidade').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'grauspararadianos');
    expect(res.body).toHaveProperty('resultado');
    // 180 graus == PI radianos
    expect(typeof res.body.resultado).toBe('string');
    expect(String(res.body.resultado)).toContain('10');
  });

  test('aceleracaoMedia', async () => {
    const payload = { v0: 0, vf: 20, t0: 0, tf: 10 };
    const res = await request(app).post('/aceleracao').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');
    // PI radianos == 180 graus
    expect(typeof res.body.resultado).toBe('string');
    expect(String(res.body.resultado)).toContain('2');
  });

  test('mruTest', async () => {
    const payload = { s0: 0, v: 10, t: 5 };
    const res = await request(app).post('/mru').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');
    // PI radianos == 180 graus
    expect(typeof res.body.resultado).toBe('string');
    expect(String(res.body.resultado)).toContain('50');
  });

  test('mruvPos', async () => {
    const payload = { s0: 0, v0: 10, a: 2, t: 5 };
    const res = await request(app).post('/mruv/posicao').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');
    // PI radianos == 180 graus
    expect(typeof res.body.resultado).toBe('string');
    expect(String(res.body.resultado)).toContain('100');
  });

  test('mruvVel', async () => {
    const payload = { v0: 10, a: 2, t: 5 };
    const res = await request(app).post('/mruv/velocidade').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');
    // PI radianos == 180 graus
    expect(typeof res.body.resultado).toBe('string');
    expect(String(res.body.resultado)).toContain('20');
  });

  test('torricelliTest', async () => {
    const payload = { v0: 0, a: 2, s: 100, s0: 0 };
    const res = await request(app).post('/torricelli').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');
    // PI radianos == 180 graus
    expect(typeof res.body.resultado).toBe('string');
    expect(String(res.body.resultado)).toContain('20');
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/velocidade').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
