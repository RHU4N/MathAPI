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
    static moda(valores) {
        if (!Array.isArray(valores) || valores.length === 0) return null;
        const counts = {};
        for (const v of valores) {
            counts[v] = (counts[v] || 0) + 1;
        }
        let maxCount = 0;
        let modes = [];
        for (const key of Object.keys(counts)) {
            const count = counts[key];
            if (count > maxCount) {
                maxCount = count;
                modes = [Number(key)];
            } else if (count === maxCount) {
                modes.push(Number(key));
            }
        }
        // If every value appears the same number of times, conventionally there is no unique mode
        if (modes.length === Object.keys(counts).length) return null;
        // If one mode, return the number; if multiple, return array
        return modes.length === 1 ? modes[0] : modes;
    }
    // Adicione outros métodos conforme necessário
}

module.exports = Estatistica;
