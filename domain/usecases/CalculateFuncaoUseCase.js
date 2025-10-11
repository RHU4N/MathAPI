const defaultStrategies = require('./strategies/funcao');

class CalculateFuncaoUseCase {
    constructor(strategies = defaultStrategies) {
        this.strategies = strategies;
    }

    execute(tipo, params) {
        const key = String(tipo).toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Tipo de função não encontrado');
        }
        return strategy(params);
    }
}

module.exports = CalculateFuncaoUseCase;
