const router = require('../controllers/energia');

/**
 * @openapi
 * /energia/trabalho:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula o trabalho realizado por uma força sobre uma distância.
 *     description: T = F * d * cos(θ).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               F:
 *                 type: number
 *                 example: 10
 *               d:
 *                 type: number
 *                 example: 2
 *               angulo:
 *                 type: number
 *                 example: 0
 *             required:
 *               - F
 *               - d
 *               - angulo
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /energia/cinetica:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a energia cinética.
 *     description: Ec = (m * v^2) / 2
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
 *               v:
 *                 type: number
 *                 example: 3
 *             required:
 *               - m
 *               - v
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /energia/potencial-gravitacional:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula energia potencial gravitacional.
 *     description: Ep = m * g * h (g assumido 9.81 se não fornecido).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               m:
 *                 type: number
 *                 example: 1
 *               h:
 *                 type: number
 *                 example: 10
 *             required:
 *               - m
 *               - h
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /energia/potencial-elastica:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula energia potencial elástica.
 *     description: Ep = (k * x^2) / 2
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

/**
 * @openapi
 * /energia/potencia:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a potência média.
 *     description: P = T / Δt (T = trabalho, Δt = intervalo de tempo)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               T:
 *                 type: number
 *                 example: 50
 *               s0:
 *                 type: number
 *                 example: 0
 *               sf:
 *                 type: number
 *                 example: 10
 *             required:
 *               - T
 *               - s0
 *               - sf
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

module.exports = router;
