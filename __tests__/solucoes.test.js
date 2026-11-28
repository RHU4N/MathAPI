const request = require('supertest');
const { createApp } = require('../app');
const solucoesStrategies = require('../domain/usecases/strategies/solucoes');

describe('Math API - /solucoes', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('calcula concentracao comum', async () => {
    const payload = { soluto: 20, volume: 0.5 };
    const res = await request(app).post('/solucoes/concentracao-comum').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*40 g\/L$/);
  });

  test('calcula molaridade', async () => {
    const payload = { soluto: 0.25, volume: 0.5 };
    const res = await request(app).post('/solucoes/molaridade').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*0\.5 mol\/L$/);
  });

  test('calcula molalidade', async () => {
    const payload = { soluto: 0.3, solvente: 0.2 };
    const res = await request(app).post('/solucoes/molalidade').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*1\.5 mol\/kg$/);
  });

  test('calcula fracao molar', async () => {
    const payload = { n1: 2, n2: 6 };
    const res = await request(app).post('/solucoes/fracao-molar').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*0\.25$/);
  });

  test('calcula densidade', async () => {
    const payload = { massa: 50, volume: 20 };
    const res = await request(app).post('/solucoes/densidade').send(payload).expect(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.resultado).toBe('string');
    expect(res.body.data.resultado).toMatch(/=\s*2\.5 g\/mL$/);
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

    expect(() => solucoesStrategies.molaridade({ soluto: NaN, volume: 1 })).toThrow(/deve|Parâmetro/);
    expect(() => solucoesStrategies.densidade({ massa: 10, volume: Infinity })).toThrow(/deve|Parâmetro/);
  });
});
