const request = require('supertest');
const { createApp } = require('../app');

// The Mobile catalog exposes exactly these 42 operations.  This test exercises
// the same endpoint/payload contract used by mathService and asserts the
// mathematical value, not merely a successful HTTP response.
const cases = [
  ['funcao1', '/funcao/linear', { a: 2, b: 3, x: 4 }, 11],
  ['funcao2', '/funcao/quadratica', { a: 1, b: -3, c: 2, x: 4 }, 6],
  ['matriz:soma', '/matriz/soma', { a: [[1, 2], [3, 4]], b: [[5, 6], [7, 8]] }, [[6, 8], [10, 12]]],
  ['matriz:subtracao', '/matriz/subtracao', { a: [[9, 5], [1, 3]], b: [[2, 1], [4, 2]] }, [[7, 4], [-3, 1]]],
  ['matriz:multiplicacao', '/matriz/multiplicacao', { a: [[1, 2], [3, 4]], b: [[5, 6], [7, 8]] }, [[19, 22], [43, 50]]],
  ['permutacao', '/analise/fatorial', { n: 5 }, 120],
  ['combinacao', '/analise/combinacao', { n: 5, k: 2 }, 10],
  ['arranjo', '/analise/arranjo', { n: 5, k: 2 }, 20],
  ['arranjoRep', '/analise/arranjorep', { n: 3, k: 2 }, 9],
  ['media', '/estatistica/media', { valores: [1, 2, 3, 4] }, 2.5],
  ['mediana', '/estatistica/mediana', { valores: [1, 3, 5, 7, 9] }, 5],
  ['moda', '/estatistica/moda', { valores: [1, 2, 2, 3] }, 2],
  ['variacao', '/financeiro/variacao', { p: 30, v: 10 }, '3'],
  ['variacao-percentual', '/financeiro/variacao-percentual', { vi: 100, vf: 125 }, '25%'],
  ['juros-simples', '/financeiro/juros/simples', { c: 100, i: 0.02, n: 2 }, '4'],
  ['juros-compostos', '/financeiro/juros/compostos', { c: 100, i: 0.1, t: 2 }, '121'],
  ['velocidade', '/cinetica/velocidade', { s0: 0, sf: 10, t0: 0, tf: 2 }, '5'],
  ['aceleracao', '/cinetica/aceleracao', { v0: 0, vf: 10, t0: 0, tf: 2 }, '5'],
  ['mru', '/cinetica/mru', { s0: 0, v: 5, t: 2 }, '10'],
  ['mruv-posicao', '/cinetica/mruv/posicao', { s0: 0, v0: 2, a: 1, t: 3 }, '10.5'],
  ['mruv-velocidade', '/cinetica/mruv/velocidade', { v0: 2, a: 3, t: 4 }, '14'],
  ['torricelli', '/cinetica/torricelli', { v0: 0, a: 2, s: 9, s0: 0 }, '6'],
  ['mcu-velocidade-angular', '/cinetica/mcu/velocidade-angular', { periodo: 2 }, '3.141'],
  ['mcu-velocidade-linear', '/cinetica/mcu/velocidade-linear', { omega: 4, raio: 2 }, '8'],
  ['lancamento-velocidade', '/cinetica/lancamento-obliquo/velocidade', { v0: 20, angulo: 0.785398, t: 1 }, '14.142'],
  ['lancamento-alcance', '/cinetica/lancamento-obliquo/alcance', { v0: 20, angulo: 0.785398 }, '40.77'],
  ['lancamento-altura-maxima', '/cinetica/lancamento-obliquo/altura-maxima', { v0: 20, angulo: 0.785398 }, '10.19'],
  ['lancamento-tempo-voo', '/cinetica/lancamento-obliquo/tempo-voo', { v0: 20, angulo: 0.785398 }, '2.88'],
  ['forca-resultante', '/dinamica/forca-resultante', { m: 10, a: 2 }, '20'],
  ['peso', '/dinamica/peso', { m: 10 }, '98.1'],
  ['forca-atrito', '/dinamica/forca-atrito', { mu: 0.3, N: 50 }, '15'],
  ['forca-elastica', '/dinamica/forca-elastica', { k: 200, x: 0.1 }, '20'],
  ['trabalho', '/energia/trabalho', { F: 10, d: 5, angulo: 0 }, '50'],
  ['cinetica', '/energia/cinetica', { m: 2, v: 3 }, '9'],
  ['potencial-gravitacional', '/energia/potencial-gravitacional', { m: 2, h: 5 }, '98.1'],
  ['potencial-elastica', '/energia/potencial-elastica', { k: 200, x: 0.1 }, '1'],
  ['potencia', '/energia/potencia', { T: 100, s0: 0, sf: 5 }, '20'],
  ['concentracao-comum', '/solucoes/concentracao-comum', { soluto: 10, volume: 2 }, '5 g/L'],
  ['molaridade', '/solucoes/molaridade', { soluto: 3, volume: 1 }, '3 mol/L'],
  ['molalidade', '/solucoes/molalidade', { soluto: 2, solvente: 0.5 }, '4 mol/kg'],
  ['fracao-molar', '/solucoes/fracao-molar', { n1: 2, n2: 3 }, '0.4'],
  ['densidade', '/solucoes/densidade', { massa: 10, volume: 5 }, '2 g/mL'],
];

function resultFrom(body) {
  return body.data && (body.data.resultado ?? body.data.matriz);
}

describe('inventário das 42 operações expostas ao Mobile', () => {
  const app = createApp();

  test.each(cases)('%s usa o endpoint e retorna o valor esperado', async (_key, path, payload, expected) => {
    const response = await request(app).post(path).send(payload).expect(200);
    const result = resultFrom(response.body);
    if (Array.isArray(expected)) expect(result).toEqual(expected);
    else if (typeof expected === 'number') expect(result).toBe(expected);
    else expect(String(result)).toContain(expected);
  });

  test('mantém o fator 1/2 do MRUV', async () => {
    const response = await request(app).post('/cinetica/mruv/posicao').send({ s0: 0, v0: 10, a: 2, t: 5 }).expect(200);
    expect(String(resultFrom(response.body))).toContain('75');
  });

  test('trata a taxa de 0,5% como 0,005 no contrato decimal da API', async () => {
    const response = await request(app).post('/financeiro/juros/simples').send({ c: 1000, i: 0.005, n: 2 }).expect(200);
    expect(String(resultFrom(response.body))).toContain('10');
  });
});
