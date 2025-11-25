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
        let resultado = strategy(params);
        // Unwrap strategy result objects that hold the numeric value under `value`
        if (resultado && typeof resultado === 'object' && Object.prototype.hasOwnProperty.call(resultado, 'value')) {
            resultado = resultado.value;
        }
        if (this.repository && typeof this.repository.save === 'function') {
            // persist but return the raw resultado (primitive or object as produced)
            await this.repository.save({ resultado });
        }
        return resultado;
    }
}

module.exports = CalculateFuncaoUseCase;
