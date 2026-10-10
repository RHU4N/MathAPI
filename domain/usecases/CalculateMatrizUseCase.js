const Matriz = require('../entities/Matriz');

class CalculateMatrizUseCase {
    execute(operacao, a, b) {
        const tipo = String(operacao || '').toLowerCase();

        switch (tipo) {
            case 'soma':
            case 'adicao':
                return Matriz.soma(a, b);
            case 'subtracao':
            case 'subtração':
                return Matriz.subtracao(a, b);
            case 'multiplicacao':
            case 'multiplicação':
                return Matriz.multiplicacao(a, b);
            default:
                throw new Error('Operação de matriz não encontrada');
        }
    }
}

module.exports = CalculateMatrizUseCase;
