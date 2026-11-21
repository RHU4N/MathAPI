const request = require('supertest');
const { createApp } = require('../app');
const solucoesStrategies = require('../domain/usecases/strategies/solucoes');

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
    expect(res.body).toHaveProperty('data.resultado');
    // strategy returns a human-readable string; assert it's a string containing the numeric result
    expect(typeof res.body.data.resultado).toBe('string');
    expect(String(res.body.data.resultado)).toContain('40');
  });

  test('calcula molaridade', async () => {
    const payload = { soluto: 0.25, volume: 0.5 };
    const res = await request(app).post('/solucoes/molaridade').send(payload).expect(200);
    expect(res.body).toHaveProperty('data.resultado');
    expect(typeof res.body.data.resultado).toBe('string');
    expect(String(res.body.data.resultado)).toContain('0.5');
  });
  
  test('calcula molalidade', async () => {
    const payload = { soluto: 0.3, solvente: 0.2 };
    const res = await request(app).post('/solucoes/molalidade').send(payload).expect(200);
    expect(res.body).toHaveProperty('data.resultado');
    expect(typeof res.body.data.resultado).toBe('string');
    expect(String(res.body.data.resultado)).toContain('1.5');
  });

  test('calcula fracao molar', async () => {
    const payload = { n1: 2, n2: 6 };
    const res = await request(app).post('/solucoes/fracao-molar').send(payload).expect(200);
    expect(res.body).toHaveProperty('data.resultado');
    expect(typeof res.body.data.resultado).toBe('string');
    expect(String(res.body.data.resultado)).toContain('0.25');
  });

  test('calcula densidade', async () => {
    const payload = { massa: 50, volume: 20 };
    const res = await request(app).post('/solucoes/densidade').send(payload).expect(200);
    expect(res.body).toHaveProperty('data.resultado');
    expect(typeof res.body.data.resultado).toBe('string');
    expect(String(res.body.data.resultado)).toContain('2.5');
  });

  test('validates missing parameters', async () => {
    const res = await request(app).post('/solucoes/molaridade').send({}).expect(400);
    expect(res.body).toHaveProperty('error');
  });

  test('rejeita divisão por zero e valores inválidos com HTTP 400', async () => {
    const r1 = await request(app).post('/solucoes/concentracao-comum').send({ soluto: 10, volume: 0 }).expect(400);
    expect(r1.body).toHaveProperty('error');

    const r2 = await request(app).post('/solucoes/molaridade').send({ soluto: 2, volume: 0 }).expect(400);
    expect(r2.body).toHaveProperty('error');

    const r3 = await request(app).post('/solucoes/molalidade').send({ soluto: 2, solvente: 0 }).expect(400);
    expect(r3.body).toHaveProperty('error');

    const r4 = await request(app).post('/solucoes/fracao-molar').send({ n1: 0, n2: 0 }).expect(400);
    expect(r4.body).toHaveProperty('error');

    const r5 = await request(app).post('/solucoes/densidade').send({ massa: 10, volume: 0 }).expect(400);
    expect(r5.body).toHaveProperty('error');

    const r6 = await request(app).post('/solucoes/concentracao-comum').send({ soluto: -1, volume: 2 }).expect(400);
    expect(r6.body).toHaveProperty('error');

    const r7 = await request(app).post('/solucoes/densidade').send({ massa: -5, volume: 2 }).expect(400);
    expect(r7.body).toHaveProperty('error');

    expect(() => solucoesStrategies['molaridade']({ soluto: NaN, volume: 1 })).toThrow(/deve|Parâmetro/);
    expect(() => solucoesStrategies['densidade']({ massa: 10, volume: Infinity })).toThrow(/deve|Parâmetro/);
  });
});
