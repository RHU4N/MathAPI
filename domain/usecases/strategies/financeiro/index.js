module.exports = {
    
    'variacao': ({ p, v } = {}) => {
        // tests expect the percentage expressed as decimal (p/100)
        const value = p / 100;
        return `Variação (decimal) = ${p} / 100 = ${value}`;
    },
    'variacao-percentual': ({ vi, vf } = {}) => {
        const diferenca = vf - vi;
        const value = (diferenca/vi)*100;
        return `Variação Porcentual = (Valor Final - Valor Inicial) / Valor Inicial = (${vf} - ${vi}) / ${vi} = ${value/100} = ${value}%`;
    },
    'juros-simples': ({ c, i, n } = {}) => {
        // tests expect the interest amount (not the montante)
        const juros = c * i * n;
        return `Juros simples = c * i * n = ${c} * ${i} * ${n} = ${juros}`;
    },
    'juros-compostos': ({ c, i, t } = {}) => {
        const value = c * Math.pow(1 + i, t);
        return `Montante = Capital (1 + Taxa)^Período = ${c} (1 + ${i})^${t} = ${value}`;
    }
};
