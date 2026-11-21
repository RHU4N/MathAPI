const request = require('supertest');
const { createApp } = require('../app');

describe('Math API - /termoquimica', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /termoquimica/calor-sensivel (e alias /calor)', () => {
    test('calcula caso obrigatório m=200, c=4.18, Ti=20, Tf=30', async () => {
      const res = await request(app)
        .post('/termoquimica/calor-sensivel')
        .send({ massa: 200, calorEspecifico: 4.18, temperaturaInicial: 20, temperaturaFinal: 30 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.valorJ).toBe(8360);
      expect(res.body.data.valorKJ).toBe(8.36);
      expect(res.body.data.deltaT).toBe(10);
      expect(res.body.data.processo).toBe('endotermico');
      expect(res.body.data.resultado).toBe('8360 J (8.36 kJ)');
    });

    test('funciona pelo alias /calor com deltaT e aliases snake_case', async () => {
      const res = await request(app)
        .post('/termoquimica/calor')
        .send({ massa: 100, calor_especifico: 4.18, delta_t: -5 })
        .expect(200);

      expect(res.body.data.valorJ).toBe(-2090);
      expect(res.body.data.valorKJ).toBe(-2.09);
      expect(res.body.data.processo).toBe('exotermico');
    });
  });

  describe('POST /termoquimica/variacao-temperatura (e alias /var-temp)', () => {
    test('calcula variação de temperatura em J e calcula temperaturaFinal', async () => {
      const res = await request(app)
        .post('/termoquimica/variacao-temperatura')
        .send({ calor: 8360, massa: 200, calorEspecifico: 4.18, temperaturaInicial: 20 })
        .expect(200);

      expect(res.body.data.deltaT).toBe(10);
      expect(res.body.data.temperaturaFinal).toBe(30);
      expect(res.body.data.unidade).toBe('°C');
    });

    test('converte kJ quando unidadeCalor === "kJ" pelo alias /var-temp', async () => {
      const res = await request(app)
        .post('/termoquimica/var-temp')
        .send({ calor: 8.36, massa: 200, calorEspecifico: 4.18, unidadeCalor: 'kJ' })
        .expect(200);

      expect(res.body.data.deltaT).toBe(10);
      expect(res.body.data.temperaturaFinal).toBeNull();
    });
  });

  describe('POST /termoquimica/entalpia-reacao (e alias /entalpia)', () => {
    test('calcula ΔH no modo produtos - reagentes', async () => {
      const res = await request(app)
        .post('/termoquimica/entalpia-reacao')
        .send({ entalpiaProdutos: -393.5, entalpiaReagentes: 0 })
        .expect(200);

      expect(res.body.data.deltaH).toBe(-393.5);
      expect(res.body.data.processo).toBe('exotermico');
    });

    test('calcula ΔH no modo molar pelo alias /entalpia', async () => {
      const res = await request(app)
        .post('/termoquimica/entalpia')
        .send({ entalpiaMolar: 180.5, moles: 2 })
        .expect(200);

      expect(res.body.data.deltaH).toBe(361);
      expect(res.body.data.processo).toBe('endotermico');
    });
  });

  describe('POST /termoquimica/entalpia-formacao', () => {
    test('calcula ΔH de combustão do metano usando ΔHf e coeficientes', async () => {
      const res = await request(app)
        .post('/termoquimica/entalpia-formacao')
        .send({
          reagentes: [
            { substancia: 'CH4', coeficiente: 1, entalpiaFormacao: -74.8 },
            { substancia: 'O2', coeficiente: 2, entalpiaFormacao: 0 }
          ],
          produtos: [
            { substancia: 'CO2', coeficiente: 1, entalpiaFormacao: -393.5 },
            { substancia: 'H2O', coeficiente: 2, entalpiaFormacao: -285.8 }
          ]
        })
        .expect(200);

      expect(res.body.data.somaProdutos).toBe(-965.1);
      expect(res.body.data.somaReagentes).toBe(-74.8);
      expect(res.body.data.deltaH).toBe(-890.3);
      expect(res.body.data.processo).toBe('exotermico');
    });
  });

  describe('POST /termoquimica/classificar-processo', () => {
    test('classifica por deltaH e por calor', async () => {
      const exo = await request(app)
        .post('/termoquimica/classificar-processo')
        .send({ deltaH: -150 })
        .expect(200);
      expect(exo.body.data.processo).toBe('exotermico');

      const endo = await request(app)
        .post('/termoquimica/classificar-processo')
        .send({ calor: 500 })
        .expect(200);
      expect(endo.body.data.processo).toBe('endotermico');
    });
  });

  describe('Validações HTTP 400 em /termoquimica', () => {
    test('rejeita massa <= 0 e calorEspecifico <= 0', async () => {
      await request(app)
        .post('/termoquimica/calor-sensivel')
        .send({ massa: 0, calorEspecifico: 4.18, deltaT: 10 })
        .expect(400);

      await request(app)
        .post('/termoquimica/calor-sensivel')
        .send({ massa: -10, calorEspecifico: 4.18, deltaT: 10 })
        .expect(400);

      await request(app)
        .post('/termoquimica/calor-sensivel')
        .send({ massa: 100, calorEspecifico: 0, deltaT: 10 })
        .expect(400);

      await request(app)
        .post('/termoquimica/variacao-temperatura')
        .send({ calor: 1000, massa: 0, calorEspecifico: 4.18 })
        .expect(400);
    });

    test('rejeita temperaturas abaixo do zero absoluto (-273.15 °C)', async () => {
      await request(app)
        .post('/termoquimica/calor-sensivel')
        .send({ massa: 100, calorEspecifico: 4.18, temperaturaInicial: -274, temperaturaFinal: 20 })
        .expect(400);

      await request(app)
        .post('/termoquimica/variacao-temperatura')
        .send({ calor: -100000, massa: 1, calorEspecifico: 1, temperaturaInicial: -270 })
        .expect(400);
    });

    test('rejeita divisões por zero e parâmetros faltantes', async () => {
      await request(app)
        .post('/termoquimica/variacao-temperatura')
        .send({ calor: 100, massa: 10, calorEspecifico: 0 })
        .expect(400);

      await request(app)
        .post('/termoquimica/entalpia-formacao')
        .send({ reagentes: [], produtos: [] })
        .expect(400);
    });
  });
});
