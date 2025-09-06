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
    // Adicione outros métodos conforme necessário
}

module.exports = AnaliseComb;
