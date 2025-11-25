const request = require('supertest');
const { createApp } = require('./app');

(async () => {
  const app = createApp();

  async function call(path, body) {
    try {
      const res = await request(app).post(path).send(body);
      console.log('CALL', path, 'STATUS', res.status);
      console.log('BODY', JSON.stringify(res.body));
    } catch (err) {
      console.error('ERR', path, err && err.message ? err.message : err);
    }
  }

  await call('/solucoes/molalidade', { soluto: 0.3, solvente: 0.2 });
  await call('/solucoes/molaridade', {});
  await call('/financeiro/variacao', { p: 30, v: 10 });

  process.exit(0);
})();
