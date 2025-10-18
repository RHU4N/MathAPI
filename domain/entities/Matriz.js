class Matriz {
    // Métodos de operações com matrizes
    static soma(a, b) {
        // Exemplo de soma de matrizes
        return a.map((row, i) => row.map((val, j) => val + b[i][j]));
    }
    // Adicione outros métodos conforme necessário
}

module.exports = Matriz;
