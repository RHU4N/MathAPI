const express = require('express');
const CalculateMatrizUseCase = require('../domain/usecases/CalculateMatrizUseCase');
const MatrizRepository = require('../infrastructure/repositories/MatrizRepository');

const router = express.Router();
const matrizUseCase = new CalculateMatrizUseCase();
const matrizRepository = new MatrizRepository();

/**
 * @openapi
 * /matriz/{operacao}:
 *   post:
 *     tags: [Matematica]
 *     summary: Realiza operações entre matrizes
 *     description: >
 *       Executa uma operação entre duas matrizes fornecidas no corpo da requisição.  
 *       Tipos de operação atualmente suportados:  
 *       - `"soma"`: soma elemento a elemento das matrizes
 *     parameters:
 *       - in: path
 *         name: operacao
 *         required: true
 *         schema:
 *           type: string
 *           enum: [soma]
 *         description: Tipo de operação a ser realizada entre as matrizes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               a:
 *                 type: array
 *                 description: Primeira matriz (array de arrays de números)
 *                 example: [[1,2],[3,4]]
 *               b:
 *                 type: array
 *                 description: Segunda matriz (array de arrays de números)
 *                 example: [[5,6],[7,8]]
 *             required:
 *               - a
 *               - b
 *     responses:
 *       200:
 *         description: Resultado da operação entre matrizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operacao:
 *                   type: string
 *                   example: soma
 *                 matriz:
 *                   type: array
 *                   description: Matriz resultante da operação
 *                   example: [[6,8],[10,12]]
 *       400:
 *         description: Erro de validação ou operação inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Operação não encontrada
 */
router.post('/:operacao', async (req, res) => {
    try {
        const { operacao } = req.params;
        const { a, b } = req.body;
        if (!operacao || !a || !b) {
            return res.status(400).json({ error: 'Operação e matrizes são obrigatórias.' });
        }
        const matriz = matrizUseCase.execute(operacao, a, b);
        matrizRepository.save({ operacao, a, b, matriz });
        res.json({ operacao, matriz });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
