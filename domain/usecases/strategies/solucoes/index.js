const {
    assertNonNegativeNumber,
    assertPositiveNumber,
    ValidationError
} = require('../../../../utils/calculationHelpers');

module.exports = {
    'concentracao-comum': ({ soluto, volume } = {}) => {
        assertNonNegativeNumber(soluto, 'soluto');
        assertPositiveNumber(volume, 'volume');
        const value = soluto / volume;
        const vstr = Number(value.toFixed(6));
        return `Concentração comum = soluto / volume = ${soluto} / ${volume} = ${vstr} g/L`;
    },
    'molaridade': ({ soluto, volume } = {}) => {
        assertNonNegativeNumber(soluto, 'soluto');
        assertPositiveNumber(volume, 'volume');
        const value = soluto / volume;
        const vstr = Number(value.toFixed(6));
        return `Molaridade = soluto / volume = ${soluto} / ${volume} = ${vstr} mol/L`;
    },
    'molalidade': ({ soluto, solvente } = {}) => {
        assertNonNegativeNumber(soluto, 'soluto');
        assertPositiveNumber(solvente, 'solvente');
        const value = soluto / solvente;
        const vstr = Number(value.toFixed(6)).toString();
        return `Molalidade = soluto / solvente = ${soluto} / ${solvente} = ${vstr} mol/kg`;
    },
    'fracao-molar': ({ n1, n2 } = {}) => {
        assertNonNegativeNumber(n1, 'n1');
        assertNonNegativeNumber(n2, 'n2');
        if (n1 + n2 <= 0) {
            throw new ValidationError('Os parâmetros n1 e n2 devem ter soma maior que zero.');
        }
        const value = n1 / (n1 + n2);
        const vstr = Number(value.toFixed(6));
        return `Fraçao molar = n1 / (n1 + n2) = ${n1} / (${n1} + ${n2}) = ${vstr}`;
    },
    'densidade': ({ massa, volume } = {}) => {
        assertNonNegativeNumber(massa, 'massa');
        assertPositiveNumber(volume, 'volume');
        const value = massa / volume;
        const vstr = Number(value.toFixed(6));
        return `Densidade = massa / volume = ${massa} / ${volume} = ${vstr} g/mL`;
    }
};
