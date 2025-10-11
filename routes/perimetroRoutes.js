const express = require('express');
const CalculatePerimetroUseCase = require('../domain/usecases/CalculatePerimetroUseCase');
const PerimetroRepository = require('../infrastructure/repositories/PerimetroRepository');

const router = express.Router();
const perimetroUseCase = new CalculatePerimetroUseCase();
const perimetroRepository = new PerimetroRepository();

/**
 * @openapi
 * /perimetro/{forma}:
 *   post:
 *     summary: Calcula o perímetro de uma forma geométrica
 *     description: >
 *       Calcula o perímetro com base na forma geométrica escolhida e nas dimensões fornecidas.  
 *       Formas suportadas no momento:
 *       - `"quadrado"`: precisa do parâmetro `lado`  
 *       - `"retangulo"`: precisa dos parâmetros `largura` e `altura`
 *     parameters:
 *       - in: path
 *         name: forma
 *         required: true
 *         schema:
 *           type: string
 *           enum: [quadrado, retangulo]
 *         description: Tipo de forma geométrica a ser calculada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 description: Parâmetro para quadrado
 *                 properties:
 *                   lado:
 *                     type: number
 *                     example: 5
 *                 required: [lado]
 *               - type: object
 *                 description: Parâmetros para retângulo
 *                 properties:
 *                   largura:
 *                     type: number
 *                     example: 5
 *                   altura:
 *                     type: number
 *                     example: 10
 *                 required: [largura, altura]
 *     responses:
 *       200:
 *         description: Retorna o perímetro calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forma:
 *                   type: string
 *                   example: quadrado
 *                 perimetro:
 *                   type: number
 *                   example: 20
 *       400:
 *         description: Erro de validação ou dimensões faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Faltando a dimensão "lado" para o quadrado
 */
router.post('/:forma', async (req, res) => {
    try {
        const { forma } = req.params;
        const dimensao = req.body;
        if (!forma || !dimensao) {
            return res.status(400).json({ error: 'Forma e dimensões são obrigatórias.' });
        }
        const perimetro = perimetroUseCase.execute(forma, dimensao);
        perimetroRepository.save({ forma, dimensao, perimetro });
        res.json({ forma, perimetro });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
