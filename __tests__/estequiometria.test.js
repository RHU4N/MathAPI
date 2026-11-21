const request = require('supertest');
const { createApp } = require('../app');
const { ELEMENTS_LIST, getElement } = require('../domain/usecases/strategies/estequiometria/periodicTable');
const { Fraction } = require('../domain/usecases/strategies/estequiometria/rational');
const { parseFormula, calculateMolarMass } = require('../domain/usecases/strategies/estequiometria/formulaParser');

describe('Math API - /estequiometria', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('Periodic table, rational arithmetic and formula parser', () => {
    test('contém todos os 118 elementos de H até Og com diferenciação de maiúsculas/minúsculas', () => {
      expect(ELEMENTS_LIST).toHaveLength(118);
      expect(getElement('H').number).toBe(1);
      expect(getElement('Og').number).toBe(118);
      expect(getElement('Co').symbol).toBe('Co');
      expect(getElement('co')).toBeNull();
    });

    test('aritmética racional exata com BigInt normaliza sinais e MDC', () => {
      const a = new Fraction(2, 4);
      const b = new Fraction(1, 3);
      expect(a.toString()).toBe('1/2');
      expect(a.add(b).toString()).toBe('5/6');
      expect(a.sub(b).toString()).toBe('1/6');
      expect(a.mul(b).toString()).toBe('1/6');
      expect(a.div(b).toString()).toBe('3/2');
      expect(new Fraction(-6, -9).toString()).toBe('2/3');
    });

    test('faz parsing de grupos aninhados e hidratos (CuSO4.5H2O e Fe4[Fe(CN)6]3)', () => {
      expect(parseFormula('CuSO4.5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 });
      expect(parseFormula('CuSO4·5H2O')).toEqual({ Cu: 1, S: 1, O: 9, H: 10 });
      expect(parseFormula('Fe4[Fe(CN)6]3')).toEqual({ Fe: 7, C: 18, N: 18 });
      expect(calculateMolarMass('CuSO4.5H2O').massaMolar).toBeCloseTo(249.677, 3);
    });
  });

  describe('POST /estequiometria/balanceamento', () => {
    test('balanceia H2 + O2 -> H2O com conservação de H e O', async () => {
      const res = await request(app)
        .post('/estequiometria/balanceamento')
        .send({ equacao: 'H2 + O2 -> H2O' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.equacaoBalanceada).toBe('2 H2 + O2 -> 2 H2O');
      expect(res.body.data.resultado).toBe('2 H2 + O2 -> 2 H2O');
      expect(res.body.data.conservacao.H).toEqual({ reagentes: 4, produtos: 4, conservado: true });
      expect(res.body.data.conservacao.O).toEqual({ reagentes: 2, produtos: 2, conservado: true });
    });

    test.each([
      ['CaCO3 -> CaO + CO2', 'CaCO3 -> CaO + CO2'],
      ['Fe + O2 -> Fe2O3', '4 Fe + 3 O2 -> 2 Fe2O3'],
      ['Al + HCl -> AlCl3 + H2', '2 Al + 6 HCl -> 2 AlCl3 + 3 H2'],
      ['C3H8 + O2 => CO2 + H2O', 'C3H8 + 5 O2 -> 3 CO2 + 4 H2O'],
      ['Ca(OH)2 + H3PO4 → Ca3(PO4)2 + H2O', '3 Ca(OH)2 + 2 H3PO4 -> Ca3(PO4)2 + 6 H2O'],
      ['KMnO4 + HCl = KCl + MnCl2 + H2O + Cl2', '2 KMnO4 + 16 HCl -> 2 KCl + 2 MnCl2 + 8 H2O + 5 Cl2']
    ])('balanceia %s -> %s', async (equacao, expected) => {
      const res = await request(app)
        .post('/estequiometria/balanceamento')
        .send({ equacao })
        .expect(200);

      expect(res.body.data.equacaoBalanceada).toBe(expected);
      for (const el of Object.values(res.body.data.conservacao)) {
        expect(el.reagentes).toBe(el.produtos);
        expect(el.conservado).toBe(true);
      }
    });

    test('aceita alias equation no payload', async () => {
      const res = await request(app)
        .post('/estequiometria/balanceamento')
        .send({ equation: '2 H2 + O2 -> 2 H2O' })
        .expect(200);

      expect(res.body.data.equacaoBalanceada).toBe('2 H2 + O2 -> 2 H2O');
    });
  });

  describe('POST /estequiometria/massa-molar', () => {
    test('calcula massa molar de H2O e CaCO3', async () => {
      const h2o = await request(app)
        .post('/estequiometria/massa-molar')
        .send({ formula: 'H2O' })
        .expect(200);
      expect(h2o.body.data.valor).toBeCloseTo(18.015, 3);
      expect(h2o.body.data.unidade).toBe('g/mol');

      const caco3 = await request(app)
        .post('/estequiometria/massa-molar')
        .send({ formula: 'CaCO3' })
        .expect(200);
      expect(caco3.body.data.valor).toBeCloseTo(100.086, 3);
    });

    test('calcula massa molar de hidrato CuSO4.5H2O', async () => {
      const res = await request(app)
        .post('/estequiometria/massa-molar')
        .send({ formula: 'CuSO4.5H2O' })
        .expect(200);
      expect(res.body.data.valor).toBeCloseTo(249.677, 3);
      expect(res.body.data.composicao.find((c) => c.elemento === 'H').quantidade).toBe(10);
    });
  });

  describe('POST /estequiometria/conversao', () => {
    test('converte gramas para mols usando fórmula automática', async () => {
      const res = await request(app)
        .post('/estequiometria/conversao')
        .send({ direcao: 'gramas-para-mols', massa: 36.03, formula: 'H2O' })
        .expect(200);
      expect(res.body.data.valor).toBeCloseTo(2, 4);
      expect(res.body.data.unidade).toBe('mol');
    });

    test('converte mols para gramas usando massaMolar explícita', async () => {
      const res = await request(app)
        .post('/estequiometria/conversao')
        .send({ direcao: 'mols-para-gramas', mols: 0.5, massaMolar: 100.086 })
        .expect(200);
      expect(res.body.data.valor).toBeCloseTo(50.043, 3);
      expect(res.body.data.unidade).toBe('g');
    });
  });

  describe('POST /estequiometria/proporcao-molar', () => {
    test('calcula proporção molar entre reagente e produto', async () => {
      const res = await request(app)
        .post('/estequiometria/proporcao-molar')
        .send({
          equacao: 'H2 + O2 -> H2O',
          especieOrigem: 'O2',
          especieDestino: 'H2O',
          quantidadeMols: 1.5
        })
        .expect(200);
      expect(res.body.data.equacaoBalanceada).toBe('2 H2 + O2 -> 2 H2O');
      expect(res.body.data.coefOrigem).toBe(1);
      expect(res.body.data.coefDestino).toBe(2);
      expect(res.body.data.molsDestino).toBe(3);
      expect(res.body.data.massaDestinoG).toBeCloseTo(54.045, 2);
    });
  });

  describe('POST /estequiometria/massa-teorica', () => {
    test('calcula massa teórica de H2O a partir da massa de H2', async () => {
      const res = await request(app)
        .post('/estequiometria/massa-teorica')
        .send({
          equacao: 'H2 + O2 -> H2O',
          reagente: 'H2',
          produto: 'H2O',
          massaReagente: 4.032
        })
        .expect(200);
      expect(res.body.data.molsReagente).toBeCloseTo(2, 4);
      expect(res.body.data.molsProduto).toBeCloseTo(2, 4);
      expect(res.body.data.massaTeoricaG).toBeCloseTo(36.03, 2);
    });
  });

  describe('POST /estequiometria/reagente-limitante', () => {
    test('identifica reagente limitante, excesso e produtos gerados', async () => {
      const res = await request(app)
        .post('/estequiometria/reagente-limitante')
        .send({
          equacao: 'H2 + O2 -> H2O',
          reagentes: [
            { formula: 'H2', mols: 3 },
            { formula: 'O2', mols: 2 }
          ],
          produtoAlvo: 'H2O'
        })
        .expect(200);

      expect(res.body.data.empateEstequiometrico).toBe(false);
      expect(res.body.data.reagenteLimitante).toBe('H2');
      expect(res.body.data.reagentesEmExcesso).toHaveLength(1);
      expect(res.body.data.reagentesEmExcesso[0].formula).toBe('O2');
      expect(res.body.data.reagentesEmExcesso[0].molsExcesso).toBe(0.5);
      expect(res.body.data.produtosGerados[0].molsGerados).toBe(3);
    });

    test('identifica empate estequiométrico exato', async () => {
      const res = await request(app)
        .post('/estequiometria/reagente-limitante')
        .send({
          equacao: 'H2 + O2 -> H2O',
          reagentes: [
            { formula: 'H2', mols: 4 },
            { formula: 'O2', mols: 2 }
          ]
        })
        .expect(200);

      expect(res.body.data.empateEstequiometrico).toBe(true);
      expect(res.body.data.reagenteLimitante).toBeNull();
      expect(res.body.data.reagentesEmExcesso).toHaveLength(0);
    });
  });

  describe('Validações HTTP 400 em /estequiometria', () => {
    test('rejeita elemento inválido Xx', async () => {
      const res = await request(app)
        .post('/estequiometria/massa-molar')
        .send({ formula: 'Xx2O' })
        .expect(400);
      expect(res.body.error).toBeTruthy();
    });

    test('rejeita parênteses desbalanceados', async () => {
      const res = await request(app)
        .post('/estequiometria/massa-molar')
        .send({ formula: 'Ca(OH2' })
        .expect(400);
      expect(res.body.error).toBeTruthy();
    });

    test('rejeita subscrito 0 e > 10000', async () => {
      await request(app).post('/estequiometria/massa-molar').send({ formula: 'H0O' }).expect(400);
      await request(app).post('/estequiometria/massa-molar').send({ formula: 'H10001' }).expect(400);
    });

    test('rejeita equação quimicamente impossível H2 -> O2', async () => {
      const res = await request(app)
        .post('/estequiometria/balanceamento')
        .send({ equacao: 'H2 -> O2' })
        .expect(400);
      expect(res.body.error).toBeTruthy();
    });

    test('rejeita equação indeterminada com múltiplas reações independentes', async () => {
      const res = await request(app)
        .post('/estequiometria/balanceamento')
        .send({ equacao: 'H2 + O2 + N2 -> H2O + NH3' })
        .expect(400);
      expect(res.body.error).toBeTruthy();
    });

    test('rejeita massa negativa na conversão e massa teórica', async () => {
      await request(app)
        .post('/estequiometria/conversao')
        .send({ direcao: 'gramas-para-mols', massa: -10, formula: 'H2O' })
        .expect(400);

      await request(app)
        .post('/estequiometria/massa-teorica')
        .send({ equacao: 'H2 + O2 -> H2O', reagente: 'H2', produto: 'H2O', massaReagente: -5 })
        .expect(400);
    });

    test('rejeita reagente faltando ou desconhecido em reagente-limitante', async () => {
      await request(app)
        .post('/estequiometria/reagente-limitante')
        .send({ equacao: 'H2 + O2 -> H2O', reagentes: [{ formula: 'H2', mols: 2 }] })
        .expect(400);

      await request(app)
        .post('/estequiometria/reagente-limitante')
        .send({ equacao: 'H2 + O2 -> H2O', reagentes: [{ formula: 'H2', mols: 2 }, { formula: 'N2', mols: 1 }] })
        .expect(400);
    });
  });
});
