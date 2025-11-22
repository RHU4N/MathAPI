const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /solucoes', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  /*
    router.post('/concentracao-comum', handle('concentracao-comum'));
    router.post('/molaridade', handle('molaridade'));
    router.post('/molalidade', handle('molalidade'));
    router.post('/fracao-molar', handle('fracao-molar'));
    router.post('/densidade', handle('densidade'));

    module.exports = {
        'concentracao-comum': ({ soluto, volume } = {}) => {
            const value = soluto / volume;
            return `Concentração comum = soluto / volume = ${soluto} / ${volume} = ${value} g/L`;
        },
        'molaridade': ({ soluto, volume } = {}) => {
            const value = soluto / volume;
            return `Molaridade = soluto / volume = ${soluto} / ${volume} = ${value} mol/L`;
        },
        'molalidade': ({ soluto, solvente } = {}) => {
            const value = soluto / solvente;
            return `Molalidade = soluto / solvente = ${soluto} / ${solvente} = ${value} mol/kg`;
        },
        'fracao-molar': ({ n1, n2 } = {}) => {
            const value = n1 / (n1 + n2);
            return `Fraçao molar = n1 / (n1 + n2) = ${n1} / (${n1} + ${n2}) = ${value}`;
        },
        'densidade': ({ massa, volume } = {}) => {
            const value = massa / volume;
            return `Densidade = massa / volume = ${massa} / ${volume} = ${value} g/mL`;
        }
    };
  */ 

  test('calcula concentracao comum', async () => {
    const payload = { soluto: 20, volume: 0.5};
    const res = await request(app).post('/solucoes/concentracao-comum').send(payload).expect(200);

    expect(res.body).toHaveProperty('resultado');
    expect(res.body.resultado).toBe(40);
  });

  test('calcula molaridade', async () => {
    const payload = { soluto: 0.25, volume: 0.5 };
    const res = await request(app).post('/solucoes/molaridade').send(payload).expect(200);

    expect(res.body).toHaveProperty('resultado');
    expect(res.body.resultado).toBe(0.5);
  });
  
  test('calcula molalidade', async () => {
    const payload = { soluto: 0.3, solvente: 0.2 };
    const res = await request(app).post('/solucoes/molalidade').send(payload).expect(200);

    expect(res.body).toHaveProperty('resultado');
    expect(res.body.resultado).toBe(1.5);
  });

  test('calcula fracao molar', async () => {
    const payload = { n1: 2, n2: 6 };
    const res = await request(app).post('/solucoes/fracao-molar').send(payload).expect(200);

    expect(res.body).toHaveProperty('resultado');
    expect(res.body.resultado).toBe(0.25);
  });

  test('calcula densidade', async () => {
    const payload = { massa: 50, volume: 20 };
    const res = await request(app).post('/solucoes/densidade').send(payload).expect(200);

    expect(res.body).toHaveProperty('resultado');
    expect(res.body.resultado).toBe(2.5);
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/solucoes/molaridade').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
