class Perimetro {
    static squarePerimeter(lado) {
        return 4 * lado;
    }
    static rectanglePerimeter(largura, altura) {
        return 2 * (largura + altura);
    }
    // Adicione outros métodos conforme necessário
}

module.exports = Perimetro;
