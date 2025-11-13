const defaultStrategies = require('./strategies/solucoes');

class CalculateSolucoesUseCase {
    constructor(repository, strategies = defaultStrategies) {
        this.repository = repository;
        this.strategies = strategies;
    }

    async execute(action, params = {}) {
        const key = String(action).toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Ação de soluções não encontrada');
        }
        const resultado = strategy(params);
        return await this.repository.save({ resultado });
    }
}

module.exports = CalculateSolucoesUseCase;
