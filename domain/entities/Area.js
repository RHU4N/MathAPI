class Area {
    static squareArea(lado) {
        return lado * lado;
    }
    static rectangleArea(largura, altura) {
        return largura * altura;
    }
    static parallelogramArea(lado, altura) {
        return lado * altura;
    }
    static trapezoidArea(altura, basemaior, basemenor) {
        return ((basemaior + basemenor) * altura) / 2;
    }
    // Outras fórmulas podem ser adicionadas aqui
}

module.exports = Area;
