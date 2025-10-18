const AnaliseComb = require('../entities/AnaliseComb');

class CalculateAnaliseCombUseCase {
    execute(tipo, params) {
        switch (tipo.toLowerCase()) {
            case 'fatorial':
                return AnaliseComb.fatorial(params.n);
            case 'combinacao':
                return AnaliseComb.combinacao(params.n, params.k);
            case 'arranjo':
                return AnaliseComb.arranjo(params.n, params.k);
                case 'arranjocomrepeticao':
                case 'arranjorep':
                    return AnaliseComb.arranjoComRepeticao(params.n, params.k);
            default:
                throw new Error('Tipo de análise combinatória não encontrado');
        }
    }
}

module.exports = CalculateAnaliseCombUseCase;
