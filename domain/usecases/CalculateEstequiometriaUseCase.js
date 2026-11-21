const defaultStrategies = require('./strategies/estequiometria');

class CalculateEstequiometriaUseCase {
    constructor(strategies = defaultStrategies) {
        this.strategies = strategies;
    }

    execute(action, params = {}) {
        const key = String(action || '').toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Ação de estequiometria não encontrada');
        }
        return strategy(params);
    }
}

module.exports = CalculateEstequiometriaUseCase;
