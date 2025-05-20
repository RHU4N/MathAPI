const express = require('express');
let Area = require('advanced-calculator'); 
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
            case 'quadrado':
                if (dimensao.lado) {
                    if (dimensao.lado === dimensao.altura) { // Verifica se é realmente um quadrado
                        result = Area.squareArea(dimensao.lado);
                    } else {
                        return res.status(400).json({ error: 'Isso não é um quadrado' });
                    }
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" para o quadrado' });
                }
                break;

            case 'triangulo':
                if (dimensao.tipo && dimensao.tipo.toLowerCase() === 'equilatero') {
                    if (dimensao.lado) {
                        const altura = (Math.sqrt(3) / 2) * dimensao.lado; // Calcula a altura automaticamente
                        result = (dimensao.lado * altura) / 2;
                    } else {
                        return res.status(400).json({ error: 'Faltando a dimensão "lado" para o triângulo equilátero' });
                    }
                } else if (dimensao.tipo && dimensao.tipo.toLowerCase() === 'isosceles') {
                    if (dimensao.lado && dimensao.altura) {
                        result = (dimensao.lado * dimensao.altura) / 2;
                    } else {
                        return res.status(400).json({ error: 'Faltando a dimensão "lado" ou "altura" para o triângulo isósceles' });
                    }
                } else if (dimensao.tipo && dimensao.tipo.toLowerCase() === 'escaleno') {
                    if (dimensao.base && dimensao.altura) {
                        result = (dimensao.base * dimensao.altura) / 2;
                    } else {
                        return res.status(400).json({ error: 'Faltando a dimensão "base" ou "altura" para o triângulo escaleno' });
                    }
                } else {
                    return res.status(400).json({ error: 'Tipo de triângulo inválido ou não especificado' });
                }
                break;

            case 'retangulo':
                if (dimensao.largura && dimensao.altura) {
                    result = Area.rectangleArea(dimensao.largura, dimensao.altura);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "largura" ou "altura" para o retângulo' });
                }
                break;

            case 'paralelogramo':
                if (dimensao.lado && dimensao.altura) {
                    result = Area.parallelogramArea(dimensao.lado, dimensao.altura);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" ou "altura" para o paralelogramo' });
                }
                break;

            case 'trapezio':
                if (dimensao.altura && dimensao.basemaior && dimensao.basemenor) {
                    result = Area.trapezoidArea(dimensao.altura, dimensao.basemaior, dimensao.basemenor);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "altura", "basemaior" ou "basemenor" para o trapezoide' });
                }
                break;
            
            case 'circulo':
                if (dimensao.raio) {
                    result = Math.PI * Math.pow(dimensao.raio, 2);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "raio" para o círculo' });
                }
                break;
            
            case 'losango':
                if (dimensao.diagonalMaior && dimensao.diagonalMenor) {
                    result = (dimensao.diagonalMaior * dimensao.diagonalMenor) / 2;
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "diagonalMaior" ou "diagonalMenor" para o losango' });
                }
                break;
            
            case 'hexagono':
                if (dimensao.lado) {
                    result = ((3 * Math.sqrt(3)) / 2) * Math.pow(dimensao.lado, 2);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" para o hexágono' });
                }
                break;
            case 'octogono':
                if (dimensao.lado) {
                    result = 2 * (1 + Math.sqrt(2)) * Math.pow(dimensao.lado, 2);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" para o octógono' });
                }
                break;
            case 'pentagono':
                if (dimensao.lado) {
                    result = (5 * Math.pow(dimensao.lado, 2)) / (4 * Math.tan(Math.PI / 5));
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" para o pentágono' });
                }
                break;
            case 'decagono':
                if (dimensao.lado) {
                    result = (5 * Math.pow(dimensao.lado, 2)) / (2 * Math.tan(Math.PI / 10));
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" para o decágono' });
                }
                break;
            case 'dodecagono':
                if (dimensao.lado) {
                    result = 3 * Math.pow(dimensao.lado, 2) * Math.tan(Math.PI / 12);
                } else {
                    return res.status(400).json({ error: 'Faltando a dimensão "lado" para o dodecágono' });
                }
                break;
            default:
                return res.status(400).json({ error: 'Forma não encontrada' });
        }

        res.json({ forma, area: result });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao calcular a área.', details: error.message });
    }
});

module.exports = router;
