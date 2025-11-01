const defaultStrategies = require('./strategies/dinamica');

class CalculateDinamicaUseCase {
    constructor(repository, strategies = defaultStrategies) {
        this.repository = repository;
        this.strategies = strategies;
    }

    async execute(action, params = {}) {
        const key = String(action).toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Ação de dinâmica não encontrada');
        }
        const resultado = strategy(params);
        return await this.repository.save({ resultado });
    }
}

module.exports = CalculateDinamicaUseCase;
