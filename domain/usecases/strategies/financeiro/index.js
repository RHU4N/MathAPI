module.exports = {
    
    'porcentagem': ({ n } = {}) => {
        const value = (n / 100) * 100;
        return `Porcentagem = n / 100 = ${n} / 100 = ${n/100} = ${value}%`;
    },
    'variacao-percentual': ({ vi, vf } = {}) => {
        const diferenca = vf - vi;
        const value = diferenca/vi;
        return `Variação Porcentual = (Valor Final - Valor Inicial) / Valor Inicial = (${vf} - ${vi}) / ${vi} = ${value} = ${value * 100}%`;
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
