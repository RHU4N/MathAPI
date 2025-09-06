const Angulo = require('../entities/Angulo');

class CalculateAnguloUseCase {
    execute(tipo, valor) {
        switch (tipo.toLowerCase()) {
            case 'radianosparagraus':
                return Angulo.radianosParaGraus(valor);
            case 'grauspararadianos':
                return Angulo.grausParaRadianos(valor);
            default:
                throw new Error('Tipo de conversão de ângulo não encontrado');
        }
    }
}

module.exports = CalculateAnguloUseCase;
