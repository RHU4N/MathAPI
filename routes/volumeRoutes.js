const express = require('express');
const CalculateVolumeUseCase = require('../domain/usecases/CalculateVolumeUseCase');
const VolumeRepository = require('../infrastructure/repositories/VolumeRepository');

const router = express.Router();
const volumeUseCase = new CalculateVolumeUseCase();
const volumeRepository = new VolumeRepository();

/**
 * @swagger
 * /volume/{forma}:
 *   post:
 *     tags: [Matematica]
 *     summary: Calcula o volume de uma forma geométrica
 *     description: >
 *       Calcula o volume de acordo com a forma geométrica escolhida e as dimensões fornecidas.  
 *       Formas suportadas atualmente:
 *       - `"cubo"`: precisa do parâmetro `lado`  
 *       - `"paralelepipedo"`: precisa dos parâmetros `largura`, `altura` e `profundidade`
 *     parameters:
 *       - in: path
 *         name: forma
 *         required: true
 *         schema:
 *           type: string
 *           enum: [cubo, paralelepipedo]
 *         description: Tipo de forma geométrica a ser calculada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 description: Parâmetro para cubo
 *                 properties:
 *                   lado:
 *                     type: number
 *                     example: 3
 *                 required: [lado]
 *               - type: object
 *                 description: Parâmetros para paralelepípedo
 *                 properties:
 *                   largura:
 *                     type: number
 *                     example: 2
 *                   altura:
 *                     type: number
 *                     example: 4
 *                   profundidade:
 *                     type: number
 *                     example: 5
 *                 required: [largura, altura, profundidade]
 *     responses:
 *       200:
 *         description: Retorna o volume calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forma:
 *                   type: string
 *                   example: cubo
 *                 volume:
 *                   type: number
 *                   example: 27
 *       400:
 *         description: Erro de validação ou dimensões faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Faltando a dimensão "lado" para o cubo
 */
router.post('/:forma', async (req, res) => {
    try {
        const { forma } = req.params;
        const dimensao = req.body;
        if (!forma || !dimensao) {
            return res.status(400).json({ error: 'Forma e dimensões são obrigatórias.' });
        }
        const volume = volumeUseCase.execute(forma, dimensao);
        volumeRepository.save({ forma, dimensao, volume });
        res.json({ forma, volume });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
