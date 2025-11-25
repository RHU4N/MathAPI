module.exports = {
    'concentracao-comum': ({ soluto, volume } = {}) => {
        const value = soluto / volume;
        const vstr = Number(value.toFixed(6));
        return `Concentração comum = soluto / volume = ${soluto} / ${volume} = ${vstr} g/L`;
    },
    'molaridade': ({ soluto, volume } = {}) => {
        const value = soluto / volume;
        const vstr = Number(value.toFixed(6));
        return `Molaridade = soluto / volume = ${soluto} / ${volume} = ${vstr} mol/L`;
    },
    'molalidade': ({ soluto, solvente } = {}) => {
        const value = soluto / solvente;
        const vstr = Number(value.toFixed(6)).toString();
        return `Molalidade = soluto / solvente = ${soluto} / ${solvente} = ${vstr} mol/kg`;
    },
    'fracao-molar': ({ n1, n2 } = {}) => {
        const value = n1 / (n1 + n2);
        const vstr = Number(value.toFixed(6));
        return `Fraçao molar = n1 / (n1 + n2) = ${n1} / (${n1} + ${n2}) = ${vstr}`;
    },
    'densidade': ({ massa, volume } = {}) => {
        const value = massa / volume;
        const vstr = Number(value.toFixed(6));
        return `Densidade = massa / volume = ${massa} / ${volume} = ${vstr} g/mL`;
    }
};
