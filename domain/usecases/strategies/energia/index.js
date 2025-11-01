module.exports = {
    'trabalho': ({ F, d, angulo } = {}) => {
        const value = F * d * Math.cos(angulo);
        return `Trabalho = F * d * cos(θ) = ${F} * ${d} * cos(${angulo}) = ${value}`;
    },
    'cinetica': ({ m, v } = {}) => {
        const value = (m * Math.pow(v, 2)) / 2;
        return `Energia cinética = (m * v^2) / 2 = (${m} * ${v}^2) / 2 = ${value}`;
    },
    'potencial-gravitacional': ({ m, h } = {}) => {
        const g = 9.81;
        const value = m * g * h;
        return `Energia potencial gravitacional = m * g * h = ${m} * ${g} * ${h} = ${value}`;
    },
    'potencial-elastica': ({ k, x } = {}) => {
        const value = (k * Math.pow(x, 2)) / 2;
        return `Energia potencial elástica = (k * x^2) / 2 = (${k} * ${x}^2) / 2 = ${value}`;
    },
    'potencia': ({ T, s0, sf } = {}) => {
        const deltaT = sf - s0;
        const value = T / deltaT;
        return `Potência = T / Δt = ${T} / ${deltaT} = ${value}`;
    }
};
