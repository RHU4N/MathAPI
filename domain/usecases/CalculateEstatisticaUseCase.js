const Estatistica = require('../entities/Estatistica');

class CalculateEstatisticaUseCase {
    execute(tipo, valores) {
        switch (tipo.toLowerCase()) {
            case 'media':
                return Estatistica.media(valores);
            case 'mediana':
                return Estatistica.mediana(valores);
            default:
                throw new Error('Tipo de estatística não encontrado');
        }
    }
}

module.exports = CalculateEstatisticaUseCase;
