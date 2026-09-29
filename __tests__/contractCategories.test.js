const request = require('supertest');
const { createApp } = require('../app');

const cases = [
  ['/area/retangulo', { largura: 5, altura: 10 }, (data) => expect(data.area).toBe(50)],
  ['/estatistica/media', { valores: [1, 2, 3] }, (data) => expect(data.resultado).toBe(2)],
  ['/analise/combinacao', { n: 5, k: 2 }, (data) => expect(data.resultado).toBe(10)],
  ['/cinetica/mru', { s0: 0, v: 10, t: 5 }, (data) => expect(data.resultado).toContain('= 50')],
  ['/solucoes/densidade', { massa: 10, volume: 2 }, (data) => expect(data.resultado).toContain('= 5 g/mL')],
  ['/financeiro/variacao', { p: 10, v: 100 }, (data) => expect(data.resultado).toContain('= 0.1')],
];

describe('contract integrations across calculation categories', () => {
  const app = createApp();

  test.each(cases)('%s returns the success envelope and expected value', async (path, body, assertValue) => {
    const response = await request(app).post(path).send(body).expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toEqual(expect.any(String));
    expect(response.body.data).toEqual(expect.any(Object));
    assertValue(response.body.data);
  });
});
