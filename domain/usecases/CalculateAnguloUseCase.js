const defaultStrategies = require('./strategies/angulo');

class CalculateAnguloUseCase {
    constructor(strategies = defaultStrategies) {
        this.strategies = strategies;
    }

    execute(tipo, valor) {
        const key = String(tipo).toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Tipo de conversão de ângulo não encontrado');
        }
        return strategy(valor);
    }
}

module.exports = CalculateAnguloUseCase;
