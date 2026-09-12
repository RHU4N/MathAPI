const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /angulo', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('converts graus to radianos', async () => {
    const payload = { valor: 180 };
    const res = await request(app).post('/angulo/grauspararadianos').send(payload).expect(200);
    expect(res.body).toHaveProperty('data.tipo', 'grauspararadianos');
    expect(res.body).toHaveProperty('data.resultado');
    // 180 graus == PI radianos
    expect(res.body.data.resultado).toBeCloseTo(Math.PI, 6);
  });

  test('converts radianos to graus', async () => {
    const payload = { valor: Math.PI };
    const res = await request(app).post('/angulo/radianosparagraus').send(payload).expect(200);
    expect(res.body).toHaveProperty('data.tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('data.resultado');
    // PI radianos == 180 graus
    expect(res.body.data.resultado).toBeCloseTo(180, 6);
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/angulo/grauspararadianos').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
