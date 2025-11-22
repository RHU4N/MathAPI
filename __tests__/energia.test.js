const request = require('supertest');
const { createApp } = require('../app');
const angulo = require('../domain/usecases/strategies/angulo');

describe('Math API - /energia', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  /*
    router.post('/trabalho', handle('trabalho'));
    router.post('/cinetica', handle('cinetica'));
    router.post('/potencial-gravitacional', handle('potencial-gravitacional'));
    router.post('/potencial-elastica', handle('potencial-elastica'));
    router.post('/potencia', handle('potencia'));

   
    
    'potencial-gravitacional': ({ m, h } = {}) => {
        const g = 9.81;
        const value = m * g * h;
        return `Energia potencial gravitacional = m * g * h = ${m} * ${g} * ${h} = ${value}`;
    },
    'potencial-elastica': ({ k, x } = {}) => {
        const value = (k * Math.pow(x, 2)) / 2;
        return `Energia potencial elástica = (k * x^2) / 2 = (${k} * ${x}^2) / 2 = ${value}`;
    },
    'potencia': ({ T, s0, sf } = {}) => {
        const deltaT = sf - s0;
        const value = T / deltaT;
        return `Potência = T / Δt = ${T} / ${deltaT} = ${value}`;
    }
  */

  test('calcula trabalho', async () => {
    const payload = { F: 20, d: 5, angulo: 30};
    const res = await request(app).post('/energia/trabalho').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'grauspararadianos');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(86.6);
  });

  test('calcula energia cinetica', async () => {
    const payload = { m: 4, v: 10 };
    const res = await request(app).post('/energia/cinetica').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBeClo(200);
  });

  test('calcula energia potencial gravitacional', async () => {
    const payload = { m: 2, h: 10};
    const res = await request(app).post('/energia/potencial-gravitacional').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBeCloseTo(196.2, 4);
  });

  test('calcula potencial elastica', async () => {
    const payload = { k:50, x: 0.3 };
    const res = await request(app).post('/energia/potencial-elastica').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(2.25);
  });

  test('calcula potencia', async () => {
    const payload = { T:500, s0: 2, sf:7 };
    const res = await request(app).post('/energia/potencia').send(payload).expect(200);
    //expect(res.body).toHaveProperty('tipo', 'radianosparagraus');
    expect(res.body).toHaveProperty('resultado');

    expect(res.body.resultado).toBe(100);
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/energia/trabalho').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
