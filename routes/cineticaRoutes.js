const router = require('../controllers/cinetica');

/**
 * @openapi
 * /cinetica/velocidade:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a velocidade média (Δs / Δt).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               s0:
 *                 type: number
 *                 example: 0
 *               sf:
 *                 type: number
 *                 example: 100
 *               t0:
 *                 type: number
 *                 example: 0
 *               tf:
 *                 type: number
 *                 example: 10
 *             required:
 *               - s0
 *               - sf
 *               - t0
 *               - tf
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/aceleracao:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a aceleração média (Δv / Δt).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               v0:
 *                 type: number
 *                 example: 0
 *               vf:
 *                 type: number
 *                 example: 20
 *               t0:
 *                 type: number
 *                 example: 0
 *               tf:
 *                 type: number
 *                 example: 4
 *             required:
 *               - v0
 *               - vf
 *               - t0
 *               - tf
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/mru:
 *   post:
 *     tags: [Fisica]
 *     summary: Cálculo da posição final no MRU (s = s0 + v * t).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               s0:
 *                 type: number
 *                 example: 0
 *               v:
 *                 type: number
 *                 example: 10
 *               t:
 *                 type: number
 *                 example: 5
 *             required:
 *               - s0
 *               - v
 *               - t
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/mruv/posicao:
 *   post:
 *     tags: [Fisica]
 *     summary: Posição final no MRUV (s = s0 + v0*t + (a * t^2)/2).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               s0:
 *                 type: number
 *                 example: 0
 *               v0:
 *                 type: number
 *                 example: 0
 *               a:
 *                 type: number
 *                 example: 9.81
 *               t:
 *                 type: number
 *                 example: 2
 *             required:
 *               - s0
 *               - v0
 *               - a
 *               - t
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/mruv/velocidade:
 *   post:
 *     tags: [Fisica]
 *     summary: Velocidade final no MRUV (v = v0 + a * t).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               v0:
 *                 type: number
 *                 example: 0
 *               a:
 *                 type: number
 *                 example: 9.81
 *               t:
 *                 type: number
 *                 example: 2
 *             required:
 *               - v0
 *               - a
 *               - t
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/torricelli:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a velocidade final pela equação de Torricelli.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               v0:
 *                 type: number
 *                 example: 0
 *               a:
 *                 type: number
 *                 example: 9.81
 *               s:
 *                 type: number
 *                 example: 10
 *               s0:
 *                 type: number
 *                 example: 0
 *             required:
 *               - v0
 *               - a
 *               - s
 *               - s0
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/mcu/velocidade-angular:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a velocidade angular (ω = 2π / T).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               periodo:
 *                 type: number
 *                 example: 2
 *             required:
 *               - periodo
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/mcu/velocidade-linear:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a velocidade linear (v = ω * r).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               omega:
 *                 type: number
 *                 example: 3.14
 *               raio:
 *                 type: number
 *                 example: 2
 *             required:
 *               - omega
 *               - raio
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/lancamento-obliquo/velocidade:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula as componentes da velocidade no lançamento oblíquo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               v0:
 *                 type: number
 *                 example: 20
 *               angulo:
 *                 type: number
 *                 example: 0.785
 *               t:
 *                 type: number
 *                 example: 1
 *             required:
 *               - v0
 *               - angulo
 *               - t
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/lancamento-obliquo/alcance:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula o alcance do lançamento oblíquo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               v0:
 *                 type: number
 *                 example: 20
 *               angulo:
 *                 type: number
 *                 example: 0.785
 *               g:
 *                 type: number
 *                 example: 9.81
 *             required:
 *               - v0
 *               - angulo
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/lancamento-obliquo/altura-maxima:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula a altura máxima do lançamento oblíquo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               v0:
 *                 type: number
 *                 example: 20
 *               angulo:
 *                 type: number
 *                 example: 0.785
 *               g:
 *                 type: number
 *                 example: 9.81
 *             required:
 *               - v0
 *               - angulo
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

/**
 * @openapi
 * /cinetica/lancamento-obliquo/tempo-voo:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula o tempo de voo do lançamento oblíquo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               v0:
 *                 type: number
 *                 example: 20
 *               angulo:
 *                 type: number
 *                 example: 0.785
 *               g:
 *                 type: number
 *                 example: 9.81
 *             required:
 *               - v0
 *               - angulo
 *     responses:
 *       200:
 *         description: Resultado do cálculo
 */

module.exports = router;
