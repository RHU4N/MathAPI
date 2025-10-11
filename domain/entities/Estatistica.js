class Estatistica {
    static media(valores) {
        return valores.reduce((a, b) => a + b, 0) / valores.length;
    }
    static mediana(valores) {
        const sorted = [...valores].sort((a, b) => a - b);
        const meio = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[meio - 1] + sorted[meio]) / 2;
        }
        return sorted[meio];
    }
    // Adicione outros métodos conforme necessário
}

module.exports = Estatistica;
