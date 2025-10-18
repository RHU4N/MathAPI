const Angulo = require('../../../entities/Angulo');

module.exports = function (valor) {
  return Angulo.grausParaRadianos(valor);
};
