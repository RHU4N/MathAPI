const request = require('supertest');
const { createApp } = require('../app');
const app = createApp();

describe('Area input validation', () => {
  test.each([-5, 0, '5', null, {}])('rejects invalid rectangle dimension %p', async largura => {
    const res = await request(app).post('/area/retangulo').send({ largura, altura: 10 }).expect(400);
    expect(res.body.error).toBeTruthy();
  });
  test('preserves a valid numeric area and response envelope', async () => {
    const res = await request(app).post('/area/retangulo').send({ largura: 5, altura: 10 }).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.area).toBe(50);
  });
});
