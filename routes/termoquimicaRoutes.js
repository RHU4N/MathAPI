const express = require('express');
const controller = require('../controllers/termoquimicaController');

const router = express.Router();

/**
 * @openapi
 * /termoquimica/calor-sensivel:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula o calor sensível Q = m · c · ΔT (em J e kJ).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               massa:
 *                 type: number
 *                 example: 200
 *               calorEspecifico:
 *                 type: number
 *                 example: 4.18
 *               temperaturaInicial:
 *                 type: number
 *                 example: 20
 *               temperaturaFinal:
 *                 type: number
 *                 example: 30
 *               deltaT:
 *                 type: number
 *                 example: 10
 *             required:
 *               - massa
 *               - calorEspecifico
 *     responses:
 *       200:
 *         description: Calor sensível calculado e processo classificado
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/calor-sensivel', controller.calorSensivel);
router.post('/calor', controller.calorSensivel);

/**
 * @openapi
 * /termoquimica/variacao-temperatura:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a variação de temperatura ΔT = Q / (m · c).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calor:
 *                 type: number
 *                 example: 8360
 *               massa:
 *                 type: number
 *                 example: 200
 *               calorEspecifico:
 *                 type: number
 *                 example: 4.18
 *               temperaturaInicial:
 *                 type: number
 *                 example: 20
 *               unidadeCalor:
 *                 type: string
 *                 enum: [J, kJ]
 *                 example: J
 *             required:
 *               - calor
 *               - massa
 *               - calorEspecifico
 *     responses:
 *       200:
 *         description: Variação de temperatura e temperatura final (se Ti informada)
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/variacao-temperatura', controller.variacaoTemperatura);
router.post('/var-temp', controller.variacaoTemperatura);

/**
 * @openapi
 * /termoquimica/entalpia-reacao:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a variação de entalpia ΔH da reação (padrão ou molar).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entalpiaProdutos:
 *                 type: number
 *                 example: -393.5
 *               entalpiaReagentes:
 *                 type: number
 *                 example: 0
 *               entalpiaMolar:
 *                 type: number
 *                 example: -890.3
 *               moles:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Variação de entalpia em kJ e classificação do processo
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/entalpia-reacao', controller.entalpiaReacao);
router.post('/entalpia', controller.entalpiaReacao);

/**
 * @openapi
 * /termoquimica/entalpia-formacao:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula ΔH de reação via entalpias padrão de formação dos reagentes e produtos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reagentes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     substancia:
 *                       type: string
 *                     coeficiente:
 *                       type: number
 *                     entalpiaFormacao:
 *                       type: number
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     substancia:
 *                       type: string
 *                     coeficiente:
 *                       type: number
 *                     entalpiaFormacao:
 *                       type: number
 *             required:
 *               - reagentes
 *               - produtos
 *     responses:
 *       200:
 *         description: Entalpia calculada via ΔHf
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/entalpia-formacao', controller.entalpiaFormacao);

/**
 * @openapi
 * /termoquimica/classificar-processo:
 *   post:
 *     tags: [Quimica]
 *     summary: Classifica um processo termoquímico a partir de ΔH ou Q.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deltaH:
 *                 type: number
 *                 example: -285.8
 *               calor:
 *                 type: number
 *                 example: 8360
 *     responses:
 *       200:
 *         description: Classificação do processo térmico
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/classificar-processo', controller.classificarProcesso);

module.exports = router;
