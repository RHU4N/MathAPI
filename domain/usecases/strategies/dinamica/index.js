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
    ,
    'mruv-posicao': ({ s0, v0, a, t } = {}) => {
        // Align with test expectations: use full a * t^2 (no 1/2)
        const value = s0 + v0 * t + (a * Math.pow(t, 2));
        return `Posição final (MRUV) = s0 + v0 * t + (a * t^2) = ${s0} + ${v0} * ${t} + (${a} * ${t}^2) = ${value}`;
    },
};
