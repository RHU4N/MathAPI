const request = require('supertest');
const { createApp } = require('../app');

const auditFailures = [
  ['arranjo com repetição sem parâmetros', '/analise/arranjorep', {}],
  ['arranjo com repetição não finito', '/analise/arranjorep', { n: 'Infinity', k: 2 }],
  ['média de lista vazia', '/estatistica/media', { valores: [] }],
  ['mediana de lista vazia', '/estatistica/mediana', { valores: [] }],
  ['moda de lista vazia', '/estatistica/moda', { valores: [] }],
  ['velocidade com intervalo zero', '/cinetica/velocidade', { s0: 0, sf: 5, t0: 1, tf: 1 }],
  ['velocidade angular com período zero', '/cinetica/mcu/velocidade-angular', { periodo: 0 }],
  ['variação percentual com valor inicial zero', '/financeiro/variacao-percentual', { vi: 0, vf: 10 }],
];

describe('regressões reproduzidas na auditoria funcional de 21/11/2026', () => {
  const app = createApp();

  test.each(auditFailures)('%s retorna erro de validação, sem sucesso não finito', async (_name, endpoint, body) => {
    const response = await request(app).post(endpoint).set('Origin', 'http://localhost:8082').send(body);
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual(expect.any(String));
    expect(response.body.error.length).toBeGreaterThan(0);
    expect(response.body.success).not.toBe(true);
    expect(response.body).not.toHaveProperty('data');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test.each([
    ['/analise/arranjorep', { n: -1, k: 2 }],
    ['/analise/arranjorep', { n: 2, k: 1.5 }],
    ['/analise/arranjorep', { n: 10, k: 1000 }],
    ['/estatistica/media', { valores: ['1', 2] }],
    ['/estatistica/mediana', { valores: [null, 2] }],
  ])('%s rejeita domínio inválido sem coerção ou resultado não finito', async (endpoint, body) => {
    const response = await request(app).post(endpoint).send(body).expect(400);
    expect(response.body.error).toEqual(expect.any(String));
    expect(response.body.success).not.toBe(true);
  });

  test.each([
    ['/analise/arranjorep', { n: 3, k: 2 }, 9],
    ['/analise/arranjoComRepeticao', { n: 3, k: 0 }, 1],
    ['/estatistica/media', { valores: [1, 2, 3, 4] }, 2.5],
    ['/estatistica/mediana', { valores: [1, 3, 5, 7, 9] }, 5],
    ['/estatistica/moda', { valores: [1, 2, 2, 3] }, 2],
    ['/estatistica/moda', { valores: [1, 2, 3] }, null],
  ])('%s preserva resultado e envelope válidos', async (endpoint, body, expected) => {
    const response = await request(app).post(endpoint).send(body).expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.resultado).toBe(expected);
  });

  test.each([
    ['/cinetica/velocidade', { s0: 0, sf: 10, t0: 0, tf: 2 }, '= 5'],
    ['/cinetica/velocidade', { s0: 10, sf: 0, t0: 0, tf: 2 }, '= -5'],
    ['/cinetica/mcu/velocidade-angular', { periodo: 2 }, '= 3.141592653589793'],
    ['/financeiro/variacao-percentual', { vi: 100, vf: 125 }, '25%'],
    ['/financeiro/variacao-percentual', { vi: 100, vf: 0 }, '-100%'],
  ])('%s preserva fórmula e valores conhecidos', async (endpoint, body, expected) => {
    const response = await request(app).post(endpoint).send(body).expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.resultado).toContain(expected);
  });
});
