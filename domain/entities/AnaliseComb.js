class AnaliseComb {
    static fatorial(n) {
        if (n <= 1) return 1;
        return n * AnaliseComb.fatorial(n - 1);
    }
    static combinacao(n, k) {
        return AnaliseComb.fatorial(n) / (AnaliseComb.fatorial(k) * AnaliseComb.fatorial(n - k));
    }
    static arranjo(n, k) {
        return AnaliseComb.fatorial(n) / AnaliseComb.fatorial(n - k);
    }
    static arranjoComRepeticao(n, k) {
        if (!Number.isInteger(n) || n < 0 || !Number.isInteger(k) || k < 0) {
            throw new Error("Os valores de 'n' e 'k' devem ser números inteiros não negativos.");
        }
        // Com repetição: n^k
        const resultado = Math.pow(n, k);
        if (!Number.isFinite(resultado)) {
            throw new Error('O resultado deve ser um número finito.');
        }
        return resultado;
    }
    // Adicione outros métodos conforme necessário
}

module.exports = AnaliseComb;
