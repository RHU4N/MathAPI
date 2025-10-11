class Volume {
    static cubeVolume(lado) {
        return Math.pow(lado, 3);
    }
    static rectangularPrismVolume(largura, altura, profundidade) {
        return largura * altura * profundidade;
    }
    // Adicione outros métodos conforme necessário
}

module.exports = Volume;
