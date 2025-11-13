const router = require('../controllers/dinamica');

/**
 * @openapi
 * /dinamica/forca-resultante:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a força resultante (F = m * a).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               m:
 *                 type: number
 *                 example: 2
 *               a:
 *                 type: number
 *                 example: 3
 *             required:
 *               - m
 *               - a
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /dinamica/peso:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula o peso (P = m * g).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               m:
 *                 type: number
 *                 example: 5
 *             required:
 *               - m
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /dinamica/forca-atrito:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a força de atrito (Fat = μ * N).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mu:
 *                 type: number
 *                 example: 0.3
 *               N:
 *                 type: number
 *                 example: 100
 *             required:
 *               - mu
 *               - N
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /dinamica/forca-elastica:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a força elástica (Fe = k * x).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               k:
 *                 type: number
 *                 example: 100
 *               x:
 *                 type: number
 *                 example: 0.2
 *             required:
 *               - k
 *               - x
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

module.exports = router;
