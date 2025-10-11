class Funcao {
    static linear(a, b, x) {
        return a * x + b;
    }
    static quadratica(a, b, c, x) {
        return a * x * x + b * x + c;
    }
    // Adicione outros métodos conforme necessário
}

module.exports = Funcao;
