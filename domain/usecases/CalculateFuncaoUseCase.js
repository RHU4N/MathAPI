const Funcao = require('../entities/Funcao');

class CalculateFuncaoUseCase {
    execute(tipo, params) {
        switch (tipo.toLowerCase()) {
            case 'linear':
                return Funcao.linear(params.a, params.b, params.x);
            case 'quadratica':
                return Funcao.quadratica(params.a, params.b, params.c, params.x);
            default:
                throw new Error('Tipo de função não encontrado');
        }
    }
}

module.exports = CalculateFuncaoUseCase;
