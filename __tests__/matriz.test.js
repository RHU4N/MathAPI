const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /matriz', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('soma duas matrizes de mesma dimensão', async () => {
    const payload = {
      a: [[1, 2], [3, 4]],
      b: [[5, 6], [7, 8]],
    };

    const res = await request(app).post('/matriz/soma').send(payload).expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data.matriz).toEqual([[6, 8], [10, 12]]);
  });

  test('subtrai duas matrizes de mesma dimensão', async () => {
    const payload = {
      a: [[9, 5], [1, 3]],
      b: [[2, 1], [4, 2]],
    };

    const res = await request(app).post('/matriz/subtracao').send(payload).expect(200);

    expect(res.body.data.matriz).toEqual([[7, 4], [-3, 1]]);
  });

  test('multiplica duas matrizes compatíveis', async () => {
    const payload = {
      a: [[1, 2], [3, 4]],
      b: [[5, 6], [7, 8]],
    };

    const res = await request(app).post('/matriz/multiplicacao').send(payload).expect(200);

    expect(res.body.data.matriz).toEqual([[19, 22], [43, 50]]);
  });

  test('valida matrizes com dimensões incompatíveis', async () => {
    const payload = {
      a: [[1, 2, 3]],
      b: [[1, 2], [3, 4]],
    };

    const res = await request(app).post('/matriz/multiplicacao').send(payload).expect(400);

    expect(res.body).toHaveProperty('error');
  });
});
