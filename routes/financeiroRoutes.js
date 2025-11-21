const router = require('../controllers/financeiro');

/**
 * @openapi
 * /financeiro/porcentagem:
 *   post:
 *     tags: [Financeiro]
 *     summary: Calcula a porcentagem.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               n:
 *                 type: number
 *                 example: 30
 *             required:
 *               - n
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /financeiro/variacao-percentual:
 *   post:
 *     tags: [Financeiro]
 *     summary: Calcula a variação percentual entre dois valores.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vi:
 *                 type: number
 *                 example: 25
 *               vf:
 *                 type: number
 *                 example: 28
 *             required:
 *               - vi
 *               - vf
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /financeiro/juros/simples:
 *   post:
 *     tags: [Financeiro]
 *     summary: Calcula o Montante por Juros Simples (M = C . (1 + i . n)).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               c:
 *                 type: number
 *                 example: 5
 *               i:
 *                 type: number
 *                 example: 15
 *               n:
 *                 type: number
 *                 example: 2
 *             required:
 *               - c
 *               - i
 *               - n
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /financeiro/juros/compostos:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula o Montante por Juros Compostos (Mn = C (1 + i)^t).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               c:
 *                 type: number
 *                 example: 10
 *               i:
 *                 type: number
 *                 example: 15
 *               t:
 *                 type: number
 *                 example: 2
 *             required:
 *               - c
 *               - i
 *               - t
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

module.exports = router;
