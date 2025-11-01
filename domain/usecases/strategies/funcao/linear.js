const Funcao = require('../../../entities/Funcao');

module.exports = function (params = {}) {
  const { a, b, x } = params;
  // If x is provided, evaluate f(x) = a*x + b
  if (typeof x === 'number') {
    return { value: Funcao.linear(a, b, x) };
  }

  // If x is not provided, solve ax + b = 0 => x = -b / a
  if (a === 0) {
    if (b === 0) {
      return { error: 'Infinitely many solutions (0 = 0)' };
    }
    return { error: 'No solution (a = 0 and b != 0)' };
  }

  const root = -b / a;
  return { roots: [root] };
};
