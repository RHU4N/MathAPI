const request = require('supertest');
const { createApp } = require('../app');

/*

    router.post('/forca-resultante', handle('forca-resultante'));
    router.post('/peso', handle('peso'));
    router.post('/forca-atrito', handle('forca-atrito'));
    router.post('/forca-elastica', handle('forca-elastica'));


    
    'peso': ({ m } = {}) => {
        const g = 9.81;
        const value = m * g;
        return `Peso = m * g = ${m} * ${g} = ${value}`;
    },
    'forca-atrito': ({ mu, N } = {}) => {
        const value = mu * N;
        return `Força de atrito = μ * N = ${mu} * ${N} = ${value}`;
    },
    'forca-elastica': ({ k, x } = {}) => {
        const value = k * x;
        return `Força elástica = k * x = ${k} * ${x} = ${value}`;
    }
*/

describe('Math API - /dinamica', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('calcula forca resultante', async () => {
    const payload = { m: 30, a: 10 };
    const res = await request(app).post('/dinamica/forca-resultante').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'grauspararadianos');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(300);
  });

  test('calcula peso', async () => {
    const payload = { m: 10 };
    const res = await request(app).post('/dinamica/peso').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(98.1);
  });

  test('calcula forca atrito', async () => {
    const payload = { mu: 15, N: 12 };
    const res = await request(app).post('/dinamica/forca-atrito').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(180);
  });

  test('calcula forca elastica', async () => {
    const payload = { k: 20, x: 75 };
    const res = await request(app).post('/dinamica/forca-elastica').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(1500);
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/dinamica/forca-resultante').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
