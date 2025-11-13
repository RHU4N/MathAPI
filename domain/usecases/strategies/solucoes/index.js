module.exports = {
    'concentracao-comum': ({ soluto, volume } = {}) => {
        const value = soluto / volume;
        return `Concentração comum = soluto / volume = ${soluto} / ${volume} = ${value} g/L`;
    },
    'molaridade': ({ soluto, volume } = {}) => {
        const value = soluto / volume;
        return `Molaridade = soluto / volume = ${soluto} / ${volume} = ${value} mol/L`;
    },
    'molalidade': ({ soluto, solvente } = {}) => {
        const value = soluto / solvente;
        return `Molalidade = soluto / solvente = ${soluto} / ${solvente} = ${value} mol/kg`;
    },
    'fracao-molar': ({ n1, n2 } = {}) => {
        const value = n1 / (n1 + n2);
        return `Fraçao molar = n1 / (n1 + n2) = ${n1} / (${n1} + ${n2}) = ${value}`;
    },
    'densidade': ({ massa, volume } = {}) => {
        const value = massa / volume;
        return `Densidade = massa / volume = ${massa} / ${volume} = ${value} g/mL`;
    }
};
