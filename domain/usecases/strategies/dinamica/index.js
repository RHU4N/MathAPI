module.exports = {
    'forca-resultante': ({ m, a } = {}) => {
        const value = m * a;
        return `Força resultante = m * a = ${m} * ${a} = ${value}`;
    },
    'peso': ({ m } = {}) => {
        const g = 9.81;
        const value = m * g;
        return `Peso = m * g = ${m} * ${g} = ${value}`;
    },
    'forca-atrito': ({ mu, N } = {}) => {
        const value = mu * N;
        return `Força de atrito = μ * N = ${mu} * ${N} = ${value}`;
    },
    'forca-elastica': ({ k, x } = {}) => {
        const value = k * x;
        return `Força elástica = k * x = ${k} * ${x} = ${value}`;
    }
};
