const Funcao = require('../../../entities/Funcao');

module.exports = function (params) {
  return Funcao.quadratica(params.a, params.b, params.c, params.x);
};
