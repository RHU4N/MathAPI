const Funcao = require('../../../entities/Funcao');

module.exports = function (params = {}) {
  const { a, b, c, x } = params;
  // If x provided, evaluate f(x) = a*x^2 + b*x + c
  if (typeof x === 'number') {
    return { value: Funcao.quadratica(a, b, c, x) };
  }

  // Solve ax^2 + bx + c = 0
  if (a === 0) {
    // Degenerates to linear bx + c = 0
    if (b === 0) {
      if (c === 0) return { error: 'Infinitely many solutions (0 = 0)' };
      return { error: 'No solution (a = 0, b = 0, c != 0)' };
    }
    const root = -c / b;
    return { roots: [root] };
  }

  const delta = Math.pow(b, 2) - 4 * a * c;
  if (delta > 0) {
    const sqrt = Math.sqrt(delta);
    const x1 = (-b - sqrt) / (2 * a);
    const x2 = (-b + sqrt) / (2 * a);
    return { delta, roots: [x1, x2] };
  }
  if (delta === 0) {
    const x0 = -b / (2 * a);
    return { delta, roots: [x0] };
  }

  // Complex roots
  const realPart = -b / (2 * a);
  const imag = Math.sqrt(-delta) / (2 * a);
  return { delta, roots: [ { real: realPart, imag: -imag }, { real: realPart, imag: imag } ] };
};
