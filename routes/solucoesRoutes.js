const router = require('../controllers/soluções');

/**
 * @openapi
 * /solucoes/concentracao-comum:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a concentração comum de uma solução.
 *     description: Recebe a quantidade de soluto (em gramas) e o volume da solução (em litros), retornando a concentração comum em g/L.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soluto:
 *                 type: number
 *                 example: 10
 *               volume:
 *                 type: number
 *                 example: 2
 *             required:
 *               - soluto
 *               - volume
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultado:
 *                   type: string
 *                   example: Concentração comum = soluto / volume = 10 / 2 = 5 g/L
 *       400:
 *         description: Parâmetros obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Parâmetros soluto e volume são obrigatórios.
 */

/**
 * @openapi
 * /solucoes/molaridade:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a molaridade de uma solução.
 *     description: Recebe a quantidade de soluto (em mols) e o volume (L) e retorna mol/L.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soluto:
 *                 type: number
 *                 example: 3
 *               volume:
 *                 type: number
 *                 example: 1
 *             required:
 *               - soluto
 *               - volume
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultado:
 *                   type: string
 *                   example: Molaridade = soluto / volume = 3 / 1 = 3 mol/L
 *       400:
 *         description: Parâmetros obrigatórios faltando
 */

/**
 * @openapi
 * /solucoes/molalidade:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a molalidade de uma solução.
 *     description: Recebe a quantidade de soluto (mols) e a massa do solvente (kg), retorna mol/kg.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soluto:
 *                 type: number
 *                 example: 2
 *               solvente:
 *                 type: number
 *                 example: 0.5
 *             required:
 *               - soluto
 *               - solvente
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 *       400:
 *         description: Parâmetros obrigatórios faltando
 */

/**
 * @openapi
 * /solucoes/fracao-molar:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a fração molar de um componente em mistura.
 *     description: Recebe n1 e n2 (mols) e retorna a fração molar do primeiro componente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               n1:
 *                 type: number
 *                 example: 2
 *               n2:
 *                 type: number
 *                 example: 3
 *             required:
 *               - n1
 *               - n2
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 *       400:
 *         description: Parâmetros obrigatórios faltando
 */

/**
 * @openapi
 * /solucoes/densidade:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a densidade (massa/volume).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               massa:
 *                 type: number
 *                 example: 10
 *               volume:
 *                 type: number
 *                 example: 2
 *             required:
 *               - massa
 *               - volume
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 *       400:
 *         description: Parâmetros obrigatórios faltando
 */

module.exports = router;
