const request = require('supertest');
const express = require('express');
const { createApp } = require('../app');
const { errorHandler, standardizeErrors } = require('../utils/errorResponse');

const envelope = (status, code) => ({
  success: false,
  error: { code, message: expect.stringMatching(/\S/), statusCode: status },
});

describe('US11 — formato único de erro (igual à LoginAPICeos)', () => {
  const app = createApp();

  test('erro de validação usa o envelope padrão', async () => {
    const res = await request(app).post('/cinetica/velocidade').send({ s0: 0, sf: 10, t0: 2, tf: 2 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual(envelope(400, 'VALIDATION_ERROR'));
    expect(res.body.error.message).toBe('O intervalo de tempo deve ser diferente de zero.');
  });

  test('422 mantém o status e recebe código próprio', async () => {
    const res = await request(app).post('/angulo/seno').send({ valor: 'abc' });
    expect(res.status).toBe(422);
    expect(res.body).toEqual(envelope(422, 'UNPROCESSABLE_ENTITY'));
  });

  test('rota inexistente responde 404 em JSON', async () => {
    const res = await request(app).post('/nao-existe').send({});
    expect(res.status).toBe(404);
    expect(res.body).toEqual(envelope(404, 'NOT_FOUND'));
  });

  test('JSON malformado responde 400 INVALID_JSON sem detalhes do parser', async () => {
    const res = await request(app).post('/funcao').set('Content-Type', 'application/json').send('{"tipo":');
    expect(res.status).toBe(400);
    expect(res.body).toEqual(envelope(400, 'INVALID_JSON'));
    expect(res.body.error.message).toBe('JSON inválido.');
  });

  test('sucesso continua no envelope { success, message, data }', async () => {
    const res = await request(app).post('/cinetica/velocidade').send({ s0: 0, sf: 10, t0: 0, tf: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, message: expect.any(String), data: expect.any(Object) });
  });

  test('erro interno não expõe a mensagem original', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const local = express();
    local.use(standardizeErrors);
    local.get('/boom', () => { throw new Error('segredo interno'); });
    local.use(errorHandler);
    const res = await request(local).get('/boom');
    spy.mockRestore();
    expect(res.status).toBe(500);
    expect(res.body).toEqual(envelope(500, 'INTERNAL_ERROR'));
    expect(JSON.stringify(res.body)).not.toContain('segredo interno');
  });

  test('respostas de sucesso e erros já padronizados não são alterados', async () => {
    const local = express();
    local.use(standardizeErrors);
    local.get('/ok', (req, res) => res.json({ error: 'campo de dado legítimo' }));
    local.get('/pronto', (req, res) => res.status(409).json({ success: false, error: { code: 'X', message: 'y', statusCode: 409 } }));
    expect((await request(local).get('/ok')).body).toEqual({ error: 'campo de dado legítimo' });
    expect((await request(local).get('/pronto')).body).toEqual({ success: false, error: { code: 'X', message: 'y', statusCode: 409 } });
  });
});
