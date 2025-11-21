module.exports = {
    
    'variacao': ({ p, v } = {}) => {
        const value = (p / 100) * v;
        return `Variação = Porcentagem% * Valor = ${p} / 100 * ${v} = ${value}`;
    },
    'variacao-percentual': ({ vi, vf } = {}) => {
        const diferenca = vf - vi;
        const value = (diferenca/vi)*100;
        return `Variação Porcentual = (Valor Final - Valor Inicial) / Valor Inicial = (${vf} - ${vi}) / ${vi} = ${value/100} = ${value}%`;
    },
    'juros-simples': ({ c, i, n } = {}) => {
        const value = c * (1 + i * n);
        return `Montante = Capital * (1 + Taxa * Período) = ${c} * (1 + ${i} * ${n}) = ${value}`;
    },
    'juros-compostos': ({ c, i, t } = {}) => {
        const value = c * Math.pow(1 + i, t);
        return `Montante = Capital (1 + Taxa)^Período = ${c} (1 + ${i})^${t} = ${value}`;
    }
};
