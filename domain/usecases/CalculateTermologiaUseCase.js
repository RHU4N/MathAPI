const defaultStrategies = require('./strategies/termologia');

class CalculateTermologiaUseCase {
    constructor(strategies = defaultStrategies) {
        this.strategies = strategies;
    }

    execute(action, params = {}) {
        const key = String(action || '').toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Ação de termologia não encontrada');
        }
        return strategy(params);
    }
}

module.exports = CalculateTermologiaUseCase;
