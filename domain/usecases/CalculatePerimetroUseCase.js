const Perimetro = require('../entities/Perimetro');

class CalculatePerimetroUseCase {
    execute(forma, dimensao) {
        let result;
        switch (forma.toLowerCase()) {
            case 'quadrado':
                if (dimensao.lado) {
                    result = Perimetro.squarePerimeter(dimensao.lado);
                } else {
                    throw new Error('Faltando a dimensão "lado" para o quadrado');
                }
                break;
            case 'retangulo':
                if (dimensao.largura && dimensao.altura) {
                    result = Perimetro.rectanglePerimeter(dimensao.largura, dimensao.altura);
                } else {
                    throw new Error('Faltando dimensões para o retângulo');
                }
                break;
            // Adicione outros casos conforme necessário
            default:
                throw new Error('Forma não encontrada');
        }
        return result;
    }
}

module.exports = CalculatePerimetroUseCase;
