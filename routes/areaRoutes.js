const express = require('express');
const CalculateAreaUseCase = require('../domain/usecases/CalculateAreaUseCase');
const AreaRepository = require('../infrastructure/repositories/AreaRepository');

const router = express.Router();
const areaUseCase = new CalculateAreaUseCase();
const areaRepository = new AreaRepository();

/**
 * @openapi
 * /area/{forma}:
 *   post:
 *     summary: Calcula a área de uma forma geométrica
 *     description: >
 *       Calcula a área de acordo com a forma geométrica escolhida e suas dimensões.  
 *       Formas suportadas e parâmetros necessários:
 *       - `quadrado`: lado (deve ser igual à altura)  
 *       - `retangulo`: largura e altura  
 *       - `paralelogramo`: lado e altura  
 *       - `trapezio`: altura, basemaior, basemenor  
 *       - `circulo`: raio  
 *       - `losango`: diagonalMaior, diagonalMenor  
 *       - `hexagono`: lado  
 *       - `octogono`: lado  
 *       - `pentagono`: lado  
 *       - `decagono`: lado  
 *       - `dodecagono`: lado  
 *       - `triangulo`: tipo (equilatero, isosceles, escaleno) e dimensões correspondentes
 *     parameters:
 *       - in: path
 *         name: forma
 *         required: true
 *         schema:
 *           type: string
 *           enum: [quadrado, retangulo, paralelogramo, trapezio, circulo, losango, hexagono, octogono, pentagono, decagono, dodecagono, triangulo]
 *         description: Forma geométrica a ser calculada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - properties:
 *                   lado:
 *                     type: number
 *                     example: 5
 *                   altura:
 *                     type: number
 *                     example: 5
 *                 required: [lado, altura]
 *                 description: Quadrado (lado = altura)
 *               - properties:
 *                   largura:
 *                     type: number
 *                     example: 5
 *                   altura:
 *                     type: number
 *                     example: 10
 *                 required: [largura, altura]
 *                 description: Retângulo
 *               - properties:
 *                   lado:
 *                     type: number
 *                     example: 6
 *                   altura:
 *                     type: number
 *                     example: 4
 *                 required: [lado, altura]
 *                 description: Paralelogramo
 *               - properties:
 *                   altura:
 *                     type: number
 *                     example: 4
 *                   basemaior:
 *                     type: number
 *                     example: 6
 *                   basemenor:
 *                     type: number
 *                     example: 3
 *                 required: [altura, basemaior, basemenor]
 *                 description: Trapézio
 *               - properties:
 *                   raio:
 *                     type: number
 *                     example: 3
 *                 required: [raio]
 *                 description: Círculo
 *               - properties:
 *                   diagonalMaior:
 *                     type: number
 *                     example: 8
 *                   diagonalMenor:
 *                     type: number
 *                     example: 6
 *                 required: [diagonalMaior, diagonalMenor]
 *                 description: Losango
 *               - properties:
 *                   lado:
 *                     type: number
 *                     example: 4
 *                 required: [lado]
 *                 description: Hexágono, Octógono, Pentágono, Decágono, Dodecágono
 *               - properties:
 *                   tipo:
 *                     type: string
 *                     enum: [equilatero, isosceles, escaleno]
 *                     example: equilatero
 *                   lado:
 *                     type: number
 *                     example: 5
 *                   altura:
 *                     type: number
 *                     example: 4
 *                   base:
 *                     type: number
 *                     example: 6
 *                 description: Triângulo (dependendo do tipo, usar os campos corretos)
 *     responses:
 *       200:
 *         description: Retorna a área calculada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forma:
 *                   type: string
 *                   example: quadrado
 *                 area:
 *                   type: number
 *                   example: 25
 *       400:
 *         description: Erro de validação ou dimensões faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Isso não é um quadrado
 */
router.post('/:forma', async (req, res) => {
    try {
        const { forma } = req.params;
        const dimensao = req.body;
        if (!forma || !dimensao) {
            return res.status(400).json({ error: 'Forma e dimensões são obrigatórias.' });
        }
        const area = areaUseCase.execute(forma, dimensao);
        areaRepository.save({ forma, dimensao, area }); // Exemplo de uso do repositório
        res.json({ forma, area });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
