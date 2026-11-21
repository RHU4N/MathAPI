const Estatistica = require('../entities/Estatistica');

class CalculateEstatisticaUseCase {
    execute(tipo, valores) {
        if (!Array.isArray(valores) || valores.length === 0 || !valores.every(Number.isFinite)) {
            throw new Error('Os valores devem ser uma lista não vazia de números finitos.');
        }
        switch (tipo.toLowerCase()) {
            case 'media':
                return Estatistica.media(valores);
            case 'mediana':
                return Estatistica.mediana(valores);
            case 'moda':
                return Estatistica.moda(valores);
            default:
                throw new Error('Tipo de estatística não encontrado');
        }
    }
}

module.exports = CalculateEstatisticaUseCase;
