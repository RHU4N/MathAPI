// Formato único de erro, igual ao da LoginAPICeos:
// { success: false, error: { code, message, statusCode } }
const CODES = {
  400: 'VALIDATION_ERROR',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_ALLOWED',
  413: 'PAYLOAD_TOO_LARGE',
  422: 'UNPROCESSABLE_ENTITY',
  500: 'INTERNAL_ERROR',
};

function errorBody(status, message, code) {
  return {
    success: false,
    error: {
      code: code || CODES[status] || (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR'),
      message,
      statusCode: status,
    },
  };
}

function errorResponse(res, status, message, code) {
  return res.status(status).json(errorBody(status, message, code));
}

// As rotas existentes respondem `{ error: 'mensagem' }`; este middleware converte qualquer
// resposta de erro nesse formato para o envelope padrão, num único ponto.
function standardizeErrors(req, res, next) {
  const json = res.json.bind(res);
  res.json = (body) => {
    if (
      res.statusCode >= 400 &&
      body && typeof body === 'object' && !Array.isArray(body) &&
      body.success === undefined && typeof body.error === 'string'
    ) {
      return json(errorBody(res.statusCode, body.error));
    }
    return json(body);
  };
  next();
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err && Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error(err && err.stack ? err.stack : err);
  if (err && err.type === 'entity.parse.failed') return errorResponse(res, 400, 'JSON inválido.', 'INVALID_JSON');
  const message = status >= 500 ? 'Erro interno no servidor' : (err && err.message) || 'Requisição inválida';
  return errorResponse(res, status, message);
}

module.exports = { errorBody, errorResponse, errorHandler, standardizeErrors };
