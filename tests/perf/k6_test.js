import http from 'k6/http';
import { check, sleep } from 'k6';

const vus = __ENV.K6_VUS ? parseInt(__ENV.K6_VUS, 10) : 10;
const duration = __ENV.K6_DURATION || '20s';
const sleepSeconds = __ENV.K6_SLEEP_MS ? parseFloat(__ENV.K6_SLEEP_MS) / 1000 : 0.1;

export const options = {
  vus,
  duration,
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

const baseUrl = (__ENV.TARGET_URL || 'http://127.0.0.1:8080').replace(/\/+$/, '');
const jsonHeaders = { headers: { 'Content-Type': 'application/json' } };

export default function () {
  const healthRes = http.get(`${baseUrl}/`);
  check(healthRes, {
    'health 200': (r) => r.status === 200,
    'health success': (r) => r.json('success') === true,
  });

  const linearRes = http.post(
    `${baseUrl}/funcao/linear`,
    JSON.stringify({ a: 2, b: 3, x: 4 }),
    jsonHeaders,
  );
  check(linearRes, {
    'funcao linear 200': (r) => r.status === 200,
    'funcao linear f(4)=11': (r) => r.json('success') === true && Number(r.json('data.resultado')) === 11,
  });

  const stoichRes = http.post(
    `${baseUrl}/estequiometria/balanceamento`,
    JSON.stringify({ equacao: 'H2 + O2 -> H2O' }),
    jsonHeaders,
  );
  check(stoichRes, {
    'estequiometria 200': (r) => r.status === 200,
    'estequiometria balanceada': (r) =>
      r.json('success') === true && r.json('data.equacaoBalanceada') === '2 H2 + O2 -> 2 H2O',
  });

  const thermoRes = http.post(
    `${baseUrl}/termoquimica/calor-sensivel`,
    JSON.stringify({ massa: 200, calorEspecifico: 4.18, temperaturaInicial: 20, temperaturaFinal: 30 }),
    jsonHeaders,
  );
  check(thermoRes, {
    'termoquimica 200': (r) => r.status === 200,
    'termoquimica Q=8360': (r) => r.json('success') === true && Number(r.json('data.valorJ')) === 8360,
  });

  const dewRes = http.post(
    `${baseUrl}/termologia/ponto-de-orvalho`,
    JSON.stringify({ temperatura: 25, umidadeRelativa: 100 }),
    jsonHeaders,
  );
  check(dewRes, {
    'ponto-de-orvalho 200': (r) => r.status === 200,
    'ponto-de-orvalho ~25': (r) =>
      r.json('success') === true && Math.abs(Number(r.json('data.pontoOrvalho')) - 25) < 0.05,
  });

  const solRes = http.post(
    `${baseUrl}/solucoes/molaridade`,
    JSON.stringify({ soluto: 3, volume: 1.5 }),
    jsonHeaders,
  );
  check(solRes, {
    'solucoes molaridade 200': (r) => r.status === 200,
    'solucoes molaridade = 2 mol/L': (r) =>
      r.json('success') === true && /=\s*2 mol\/L$/.test(String(r.json('data.resultado'))),
  });

  if (sleepSeconds > 0) sleep(sleepSeconds);
}
