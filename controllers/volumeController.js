const express = require('express');
let Volume  = require('advanced-calculator'); // Não é necessário instanciar
const router = express.Router();

router.post('/:forma', async (req, res) => {
    try {
        const { forma } = req.params;
        const dimensao = req.body;

        if (!forma || !dimensao) {
            return res.status(400).json({ error: 'Forma e dimensões são obrigatórias.' });
        }

        let result;
        switch (forma.toLowerCase()) {
            case 'esfera':
                result= Volume.sphereVolume(dimensao.raio);
                break;

            case 'cubo':
                result = Volume.cubeVolume(dimensao.lado);
                break;

            case 'prismaretangular': 
                if (dimensao.largura && dimensao.altura && dimensao.comprimento) {
                    result = Volume.rectangularprizmVolume(dimensao.largura, dimensao.altura, dimensao.comprimento);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "largura", "altura" ou "comprimento" para o prisma retangular' });
                }
                break;

            case 'cilindro':
                if (dimensao.raio && dimensao.altura) {
                    result = Volume.cylinderVolume(dimensao.raio, dimensao.altura);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "raio" ou "altura" para o cilindro' });
                }
                break;

            case 'cone':
                if (dimensao.raio && dimensao.altura) {
                    result = Volume.coneVolume(dimensao.raio, dimensao.altura);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "raio" ou "altura" para o cone' });
                }
                break;

            case 'piramide':
                if (dimensao.tipoBase && dimensao.altura) {
                    switch (dimensao.tipoBase.toLowerCase()) {
                        case 'quadrada':
                            if (dimensao.lado) {
                                result = (1 / 3) * Math.pow(dimensao.lado, 2) * dimensao.altura;
                            } else {
                                return res.status(400).json({ error: 'Faltando a dimensão "lado" para a base quadrada da pirâmide' });
                            }
                            break;

                        case 'retangular':
                            if (dimensao.largura && dimensao.comprimento) {
                                result = (1 / 3) * dimensao.largura * dimensao.comprimento * dimensao.altura;
                            } else {
                                return res.status(400).json({ error: 'Faltando a dimensão "largura" ou "comprimento" para a base retangular da pirâmide' });
                            }
                            break;

                        case 'triangular':
                            if (dimensao.base && dimensao.alturaBase) {
                                result = (1 / 3) * (0.5 * dimensao.base * dimensao.alturaBase) * dimensao.altura;
                            } else {
                                return res.status(400).json({ error: 'Faltando a dimensão "base" ou "alturaBase" para a base triangular da pirâmide' });
                            }
                            break;

                        case 'hexagonal':
                            if (dimensao.lado) {
                                const areaBase = ((3 * Math.sqrt(3)) / 2) * Math.pow(dimensao.lado, 2);
                                result = (1 / 3) * areaBase * dimensao.altura;
                            } else {
                                return res.status(400).json({ error: 'Faltando a dimensão "lado" para a base hexagonal da pirâmide' });
                            }
                            break;

                        case 'pentagonal':
                            if (dimensao.lado) {
                                const areaBase = ((5 / 2) * Math.sqrt(5 * (5 + 2 * Math.sqrt(5)))) * Math.pow(dimensao.lado, 2);
                                result = (1 / 3) * areaBase * dimensao.altura;
                            } else {
                                return res.status(400).json({ error: 'Faltando a dimensão "lado" para a base pentagonal da pirâmide' });
                            }
                            break;

                        default:
                            return res.status(400).json({ error: 'Tipo de base da pirâmide não suportado' });
                    }
                } else {
                    return res.status(400).json({ error: 'Faltando o "tipoBase" ou "altura" para a pirâmide' });
                }
                break;
            
            case 'prismahexagonal':
                if (dimensao.lado && dimensao.altura) {
                    result = ((3 * Math.sqrt(3)) / 2) * Math.pow(dimensao.lado, 2) * dimensao.altura;
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" ou "altura" para o prisma hexagonal' });
                }
                break;
            
            case 'prismapentagonal':
                if (dimensao.lado && dimensao.altura) {
                    result = ((5 / 2) * Math.sqrt(5 * (5 + 2 * Math.sqrt(5)))) * Math.pow(dimensao.lado, 2) * dimensao.altura;
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" ou "altura" para o prisma pentagonal' });
                }
                break;

            default:
                return res.status(400).json({ error: 'Forma não encontrada' });
        }

        res.json({ forma, volume: result });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao calcular o volume.', details: error.message });
    }
});

module.exports = router;
