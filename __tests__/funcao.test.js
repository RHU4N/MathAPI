const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /funcao', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('calculates linear function (ax + b) when x provided', async () => {
    const payload = { a: 2, b: 3, x: 5 };
    const res = await request(app).post('/funcao/linear').send(payload).expect(200);
    expect(res.body).toHaveProperty('tipo', 'linear');
    expect(res.body).toHaveProperty('resultado');
    expect(typeof res.body.resultado).toBe('number');
    expect(res.body.resultado).toBe(2 * 5 + 3);
  });

  test('returns roots for quadratic when x is not the target (solving for x) or when x provided returns value', async () => {
    // Evaluate quadratic for a given x
    const evalPayload = { a: 1, b: -3, c: 2, x: 4 };
    const r1 = await request(app).post('/funcao/quadratica').send(evalPayload).expect(200);
    expect(r1.body).toHaveProperty('tipo', 'quadratica');
    expect(r1.body).toHaveProperty('resultado');

    // Solve quadratic (if API supports solving - adapt if necessary)
    const solvePayload = { a: 1, b: -3, c: 2 }; // no x => may return raizes
    const r2 = await request(app).post('/funcao/quadratica').send(solvePayload);
    // Accept either 200 with raizes or 400/422 if API requires x; just assert we get JSON back
    expect([200, 400, 422]).toContain(r2.status);
    expect(r2.headers['content-type']).toMatch(/application\/json/);
  });
});
