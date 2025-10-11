const express = require('express');
const CalculateFuncaoUseCase = require('../domain/usecases/CalculateFuncaoUseCase');
const FuncaoRepository = require('../infrastructure/repositories/FuncaoRepository');

const router = express.Router();
const funcaoUseCase = new CalculateFuncaoUseCase();
const funcaoRepository = new FuncaoRepository();

/**
 * @openapi
 * /funcao/{tipo}:
 *   post:
 *     summary: Calcula o valor de uma função linear ou quadrática
 *     description: >
 *       Realiza o cálculo de uma função com base no tipo informado.
 *       O tipo define se será uma **função linear** (`ax + b`) ou **quadrática** (`ax² + bx + c`).
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [linear, quadratica]
 *         description: >
 *           Tipo de função a ser calculada.
 *           Pode ser `"linear"` para funções no formato `ax + b` ou `"quadratica"` para `ax² + bx + c`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - properties:
 *                   a:
 *                     type: number
 *                     example: 2
 *                   b:
 *                     type: number
 *                     example: 3
 *                   x:
 *                     type: number
 *                     example: 5
 *                 required: [a, b, x]
 *                 description: Parâmetros necessários para uma função linear.
 *               - properties:
 *                   a:
 *                     type: number
 *                     example: 1
 *                   b:
 *                     type: number
 *                     example: -3
 *                   c:
 *                     type: number
 *                     example: 2
 *                   x:
 *                     type: number
 *                     example: 4
 *                 required: [a, b, c, x]
 *                 description: Parâmetros necessários para uma função quadrática.
 *     responses:
 *       200:
 *         description: Retorna o tipo de função e o resultado calculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipo:
 *                   type: string
 *                   example: "linear"
 *                 resultado:
 *                   type: number
 *                   example: 13
 *       400:
 *         description: Erro nos parâmetros ou tipo inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Tipo de função não encontrado
 */

router.post('/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;
        const params = req.body;
        if (!tipo || !params) {
            return res.status(400).json({ error: 'Tipo e parâmetros são obrigatórios.' });
        }
        const resultado = funcaoUseCase.execute(tipo, params);
        funcaoRepository.save({ tipo, params, resultado });
        res.json({ tipo, resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
