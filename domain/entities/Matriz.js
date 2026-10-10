class Matriz {
    static validarDimensoes(a, b, operacao) {
        if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
            throw new Error('As matrizes devem ser arrays bidimensionais válidos.');
        }

        const linhasA = a.length;
        const colunasA = Array.isArray(a[0]) ? a[0].length : 0;
        const linhasB = b.length;
        const colunasB = Array.isArray(b[0]) ? b[0].length : 0;

        if (!a.every((linha) => Array.isArray(linha)) || !b.every((linha) => Array.isArray(linha))) {
            throw new Error('Cada linha da matriz deve ser um array.');
        }

        const tamanhoValido = (matriz) => matriz.every((linha) => linha.length === colunasA || linha.length === colunasB);

        if (operacao === 'soma' || operacao === 'subtracao') {
            if (linhasA !== linhasB || colunasA !== colunasB) {
                throw new Error('Para soma e subtração, as matrizes devem ter a mesma dimensão.');
            }
        }

        if (operacao === 'multiplicacao' && colunasA !== linhasB) {
            throw new Error('Para multiplicação, o número de colunas da primeira matriz deve ser igual ao número de linhas da segunda.');
        }

        return { linhasA, colunasA, linhasB, colunasB };
    }

    static soma(a, b) {
        const { linhasA, colunasA } = Matriz.validarDimensoes(a, b, 'soma');

        return Array.from({ length: linhasA }, (_, i) =>
            Array.from({ length: colunasA }, (_, j) => Number(a[i][j]) + Number(b[i][j]))
        );
    }

    static subtracao(a, b) {
        const { linhasA, colunasA } = Matriz.validarDimensoes(a, b, 'subtracao');

        return Array.from({ length: linhasA }, (_, i) =>
            Array.from({ length: colunasA }, (_, j) => Number(a[i][j]) - Number(b[i][j]))
        );
    }

    static multiplicacao(a, b) {
        const { linhasA, colunasA, linhasB, colunasB } = Matriz.validarDimensoes(a, b, 'multiplicacao');

        const resultado = Array.from({ length: linhasA }, () => Array(colunasB).fill(0));

        for (let i = 0; i < linhasA; i += 1) {
            for (let j = 0; j < colunasB; j += 1) {
                let soma = 0;
                for (let k = 0; k < colunasA; k += 1) {
                    soma += Number(a[i][k]) * Number(b[k][j]);
                }
                resultado[i][j] = soma;
            }
        }

        return resultado;
    }
}

module.exports = Matriz;
