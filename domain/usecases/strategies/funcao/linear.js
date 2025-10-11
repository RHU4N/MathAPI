const Funcao = require('../../../entities/Funcao');

module.exports = function (params) {
  return Funcao.linear(params.a, params.b, params.x);
};
