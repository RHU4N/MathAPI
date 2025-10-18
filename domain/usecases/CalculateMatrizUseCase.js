const Matriz = require('../entities/Matriz');

class CalculateMatrizUseCase {
    execute(operacao, a, b) {
        let result;
        switch (operacao.toLowerCase()) {
            case 'soma':
                result = Matriz.soma(a, b);
                break;
            // Adicione outros casos conforme necessário
            default:
                throw new Error('Operação não encontrada');
        }
        return result;
    }
}

module.exports = CalculateMatrizUseCase;
