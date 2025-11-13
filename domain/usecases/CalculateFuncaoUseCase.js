const defaultStrategies = require('./strategies/funcao');

class CalculateFuncaoUseCase {
    constructor(repository = null, strategies = defaultStrategies) {
        this.repository = repository;
        this.strategies = strategies;
    }

    async execute(tipo, params) {
        const key = String(tipo).toLowerCase();
        const strategy = this.strategies[key];
        if (!strategy) {
            throw new Error('Tipo de função não encontrado');
        }
        const resultado = strategy(params);
        if (this.repository && typeof this.repository.save === 'function') {
            return await this.repository.save({ resultado });
        }
        return resultado;
    }
}

module.exports = CalculateFuncaoUseCase;
