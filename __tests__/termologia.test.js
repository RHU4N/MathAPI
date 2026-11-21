const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /termologia', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /termologia/ponto-de-orvalho', () => {
    test('calcula caso obrigatório T=24, UR=40 com Td ≈ 9.56 °C', async () => {
      const res = await request(app)
        .post('/termologia/ponto-de-orvalho')
        .send({ temperatura: 24, umidadeRelativa: 40 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Math.abs(res.body.data.pontoOrvalho - 9.56)).toBeLessThan(0.05);
      expect(res.body.data.pontoOrvalho).toBeLessThanOrEqual(24);
      expect(res.body.data.unidade).toBe('°C');
      expect(res.body.data.dominioValido).toBe(true);
      expect(res.body.data.origem).toBe('manual');
    });

    test('retorna pontoOrvalho === temperatura quando UR=100%', async () => {
      for (const temp of [-45, 0, 24, 60]) {
        const res = await request(app)
          .post('/termologia/ponto-de-orvalho')
          .send({ temperatura: temp, umidadeRelativa: 100, origem: 'sensor' })
          .expect(200);

        expect(res.body.data.pontoOrvalho).toBe(temp);
        expect(res.body.data.diferencaOrvalho).toBe(0);
        expect(res.body.data.origem).toBe('sensor');
      }
    });

    test('respeita os limites válidos de domínio [-45 °C, 60 °C]', async () => {
      const minRes = await request(app)
        .post('/termologia/ponto-de-orvalho')
        .send({ temperatura: -45, umidadeRelativa: 50 })
        .expect(200);
      expect(minRes.body.data.pontoOrvalho).toBeLessThanOrEqual(-45);

      const maxRes = await request(app)
        .post('/termologia/ponto-de-orvalho')
        .send({ temperatura: 60, umidadeRelativa: 50 })
        .expect(200);
      expect(maxRes.body.data.pontoOrvalho).toBeLessThanOrEqual(60);
    });

    test.each([
      { temperatura: 24, umidadeRelativa: 0 },
      { temperatura: 24, umidadeRelativa: -5 },
      { temperatura: 24, umidadeRelativa: 101 },
      { temperatura: -50, umidadeRelativa: 50 },
      { temperatura: 65, umidadeRelativa: 50 },
      { temperatura: -300, umidadeRelativa: 50 },
      { temperatura: '24', umidadeRelativa: 40 },
      { temperatura: 24, umidadeRelativa: '40' },
      {}
    ])('rejeita entrada inválida %p com HTTP 400', async (payload) => {
      const res = await request(app)
        .post('/termologia/ponto-de-orvalho')
        .send(payload)
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });
});
