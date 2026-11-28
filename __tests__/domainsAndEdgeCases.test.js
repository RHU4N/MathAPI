const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - cobertura de domínios sem suíte dedicada e entradas inválidas', () => {
  const app = createApp();

  describe('/estatistica', () => {
    test('calcula media, mediana (par e ímpar) e moda (única, multimodal e amodal)', async () => {
      const media = await request(app).post('/estatistica/media').send({ valores: [10, 20, 30, 40] }).expect(200);
      expect(media.body).toMatchObject({ success: true, data: { tipo: 'media', resultado: 25 } });

      const medImpar = await request(app).post('/estatistica/mediana').send({ valores: [9, 1, 5] }).expect(200);
      expect(medImpar.body).toMatchObject({ success: true, data: { tipo: 'mediana', resultado: 5 } });

      const medPar = await request(app).post('/estatistica/mediana').send({ valores: [10, 2, 4, 8] }).expect(200);
      expect(medPar.body).toMatchObject({ success: true, data: { tipo: 'mediana', resultado: 6 } });

      const modaUnica = await request(app).post('/estatistica/moda').send({ valores: [1, 2, 2, 3] }).expect(200);
      expect(modaUnica.body).toMatchObject({ success: true, data: { tipo: 'moda', resultado: 2 } });

      const modaMulti = await request(app).post('/estatistica/moda').send({ valores: [1, 1, 2, 2, 3] }).expect(200);
      expect(modaMulti.body.success).toBe(true);
      expect(modaMulti.body.data.resultado).toEqual([1, 2]);

      const amodal = await request(app).post('/estatistica/moda').send({ valores: [1, 2, 3] }).expect(200);
      expect(amodal.body).toMatchObject({ success: true, data: { tipo: 'moda', resultado: null } });
    });

    test('rejeita tipo de estatística inválido ou corpo sem valores', async () => {
      await request(app).post('/estatistica/desvio').send({ valores: [1, 2, 3] }).expect(400);
      await request(app).post('/estatistica/media').send({}).expect(400);
    });
  });

  describe('/analise', () => {
    test('calcula fatorial (inclusive 0), combinacao, arranjo e arranjoComRepeticao', async () => {
      const fat0 = await request(app).post('/analise/fatorial').send({ n: 0 }).expect(200);
      expect(fat0.body).toMatchObject({ success: true, data: { tipo: 'fatorial', resultado: 1 } });

      const fat5 = await request(app).post('/analise/fatorial').send({ n: 5 }).expect(200);
      expect(fat5.body.data.resultado).toBe(120);

      const comb = await request(app).post('/analise/combinacao').send({ n: 6, k: 2 }).expect(200);
      expect(comb.body.data.resultado).toBe(15);

      const arr = await request(app).post('/analise/arranjo').send({ n: 6, k: 2 }).expect(200);
      expect(arr.body.data.resultado).toBe(30);

      const arrRep = await request(app).post('/analise/arranjoComRepeticao').send({ n: 2, k: 4 }).expect(200);
      expect(arrRep.body.data.resultado).toBe(16);
    });

    test('rejeita tipo inexistente e corpo ausente em /analise', async () => {
      await request(app).post('/analise/inexistente').send({ n: 4, k: 2 }).expect(400);
      await request(app).post('/analise/combinacao').send(null).expect(400);
    });
  });

  describe('/perimetro e /volume', () => {
    test('calcula perímetro de quadrado e retângulo com contrato de sucesso', async () => {
      const quad = await request(app).post('/perimetro/quadrado').send({ lado: 5 }).expect(200);
      expect(quad.body).toMatchObject({ success: true, data: { forma: 'quadrado', perimetro: 20 } });

      const ret = await request(app).post('/perimetro/retangulo').send({ largura: 5, altura: 10 }).expect(200);
      expect(ret.body).toMatchObject({ success: true, data: { forma: 'retangulo', perimetro: 30 } });
    });

    test('rejeita dimensões faltantes e forma desconhecida em /perimetro', async () => {
      await request(app).post('/perimetro/quadrado').send({}).expect(400);
      await request(app).post('/perimetro/retangulo').send({ largura: 5 }).expect(400);
      await request(app).post('/perimetro/hexagono').send({ lado: 5 }).expect(400);
    });

    test('calcula volume de cubo e paralelepípedo com contrato de sucesso', async () => {
      const cubo = await request(app).post('/volume/cubo').send({ lado: 3 }).expect(200);
      expect(cubo.body).toMatchObject({ success: true, data: { forma: 'cubo', volume: 27 } });

      const para = await request(app)
        .post('/volume/paralelepipedo')
        .send({ largura: 2, altura: 4, profundidade: 5 })
        .expect(200);
      expect(para.body).toMatchObject({ success: true, data: { forma: 'paralelepipedo', volume: 40 } });
    });

    test('rejeita dimensões faltantes e forma desconhecida em /volume', async () => {
      await request(app).post('/volume/cubo').send({}).expect(400);
      await request(app).post('/volume/paralelepipedo').send({ largura: 2, altura: 4 }).expect(400);
      await request(app).post('/volume/cone').send({ raio: 2, altura: 5 }).expect(400);
    });
  });

  describe('rotas inexistentes e parâmetros faltantes em física/financeiro', () => {
    test.each([
      '/cinetica/inexistente',
      '/dinamica/inexistente',
      '/energia/inexistente',
      '/financeiro/inexistente',
    ])('retorna 404 para rota não mapeada %s', async (endpoint) => {
      await request(app).post(endpoint).send({ x: 1 }).expect(404);
    });

    test.each([
      ['/cinetica/mruv/posicao', {}],
      ['/dinamica/peso', {}],
      ['/energia/cinetica', {}],
      ['/financeiro/juros/compostos', {}],
    ])('rejeita %s com status 400 e mensagem de erro', async (endpoint, body) => {
      const res = await request(app).post(endpoint).send(body).expect(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
