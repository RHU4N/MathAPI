const express = require('express');

// Factory: createFuncaoRouter({ useCase, repository })
const CalculateFuncaoUseCase = require('../domain/usecases/CalculateFuncaoUseCase');
const FuncaoRepository = require('../infrastructure/repositories/FuncaoRepository');

function createFuncaoRouter(deps = {}) {
    const router = express.Router();
    const funcaoUseCase = deps.useCase || new CalculateFuncaoUseCase();
    const funcaoRepository = deps.repository || new FuncaoRepository();

/**
 * @openapi
 * /funcao/{tipo}:
 *   post:
 *     tags: [Matematica]
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

        // Basic numeric validation depending on type
        const t = String(tipo).toLowerCase();
        if (t === 'linear') {
            const { a, b } = params;
            if ([a, b].some(v => v === undefined || typeof v !== 'number')) {
                return res.status(422).json({ error: 'Parâmetros inválidos para função linear. a e b são obrigatórios e devem ser números. x é opcional (se ausente será resolvido).' });
            }
        } else if (t === 'quadratica') {
            const { a, b, c } = params;
            if ([a, b, c].some(v => v === undefined || typeof v !== 'number')) {
                return res.status(422).json({ error: 'Parâmetros inválidos para função quadrática. a, b e c são obrigatórios e devem ser números. x é opcional (se ausente será resolvido).' });
            }
        }

        const resultado = await funcaoUseCase.execute(tipo, params);
        if (funcaoRepository && typeof funcaoRepository.save === 'function') {
            await funcaoRepository.save({ tipo, params, resultado });
        }
        res.json({ tipo, resultado });
    } catch (error) {
        const msg = error && error.message ? String(error.message) : 'Erro interno no servidor';
        const lower = msg.toLowerCase();
        const status = (lower.includes('parâmetr') || lower.includes('obrig') || lower.includes('deve')) ? 400 : 500;
        const responseMsg = status === 500 ? 'Erro interno no servidor' : msg;
        res.status(status).json({ error: responseMsg });
    }
});

    return router;
}

const defaultRouter = createFuncaoRouter();
module.exports = function(opts) {
    if (opts && typeof opts === 'object') return createFuncaoRouter(opts);
    return defaultRouter;
};
