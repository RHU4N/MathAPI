class Angulo {
    static radianosParaGraus(rad) {
        return rad * (180 / Math.PI);
    }
    static grausParaRadianos(graus) {
        return graus * (Math.PI / 180);
    }
    // Adicione outros métodos conforme necessário
}

module.exports = Angulo;
