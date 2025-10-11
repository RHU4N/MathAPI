const Volume = require('../entities/Volume');

class CalculateVolumeUseCase {
    execute(forma, dimensao) {
        let result;
        switch (forma.toLowerCase()) {
            case 'cubo':
                if (dimensao.lado) {
                    result = Volume.cubeVolume(dimensao.lado);
                } else {
                    throw new Error('Faltando a dimensão "lado" para o cubo');
                }
                break;
            case 'paralelepipedo':
                if (dimensao.largura && dimensao.altura && dimensao.profundidade) {
                    result = Volume.rectangularPrismVolume(dimensao.largura, dimensao.altura, dimensao.profundidade);
                } else {
                    throw new Error('Faltando dimensões para o paralelepípedo');
                }
                break;
            // Adicione outros casos conforme necessário
            default:
                throw new Error('Forma não encontrada');
        }
        return result;
    }
}

module.exports = CalculateVolumeUseCase;
