const defaultStrategies = require('./strategies/termoquimica');

class CalculateTermoquimicaUseCase {
    constructor(strategies = defaultStrategies) {
        this.strategies = strategies;
    }

    execute(action, params = {}) {
        const key = String(action || '').toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Ação de termoquímica não encontrada');
        }
        return strategy(params);
    }
}

module.exports = CalculateTermoquimicaUseCase;
