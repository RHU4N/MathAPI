const express = require('express');
const controller = require('../controllers/estequiometriaController');

const router = express.Router();

/**
 * @openapi
 * /estequiometria/balanceamento:
 *   post:
 *     tags: [Quimica]
 *     summary: Balanceia uma equação química determinística por álgebra linear exata.
 *     description: Recebe uma equação química separada por ->, =>, → ou = e retorna os menores coeficientes inteiros positivos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equacao:
 *                 type: string
 *                 example: H2 + O2 -> H2O
 *             required:
 *               - equacao
 *     responses:
 *       200:
 *         description: Equação balanceada e verificação de conservação de átomos
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/balanceamento', controller.balanceamento);

/**
 * @openapi
 * /estequiometria/massa-molar:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a massa molar (g/mol) de uma fórmula química.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formula:
 *                 type: string
 *                 example: CaCO3
 *             required:
 *               - formula
 *     responses:
 *       200:
 *         description: Massa molar e composição elementar
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/massa-molar', controller.massaMolar);

/**
 * @openapi
 * /estequiometria/conversao:
 *   post:
 *     tags: [Quimica]
 *     summary: Converte massa (g) para mols ou mols para massa (g).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               direcao:
 *                 type: string
 *                 enum: [gramas-para-mols, mols-para-gramas]
 *                 example: gramas-para-mols
 *               massa:
 *                 type: number
 *                 example: 36.03
 *               mols:
 *                 type: number
 *                 example: 2
 *               formula:
 *                 type: string
 *                 example: H2O
 *               massaMolar:
 *                 type: number
 *                 example: 18.015
 *             required:
 *               - direcao
 *     responses:
 *       200:
 *         description: Valor convertido
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/conversao', controller.conversao);

/**
 * @openapi
 * /estequiometria/proporcao-molar:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula a proporção molar entre duas espécies de uma equação química.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equacao:
 *                 type: string
 *                 example: H2 + O2 -> H2O
 *               especieOrigem:
 *                 type: string
 *                 example: O2
 *               especieDestino:
 *                 type: string
 *                 example: H2O
 *               quantidadeMols:
 *                 type: number
 *                 example: 1.5
 *             required:
 *               - equacao
 *               - especieOrigem
 *               - especieDestino
 *               - quantidadeMols
 *     responses:
 *       200:
 *         description: Proporção molar e massas equivalentes
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/proporcao-molar', controller.proporcaoMolar);

/**
 * @openapi
 * /estequiometria/massa-teorica:
 *   post:
 *     tags: [Quimica]
 *     summary: Calcula o rendimento teórico em massa de um produto a partir de um reagente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equacao:
 *                 type: string
 *                 example: H2 + O2 -> H2O
 *               reagente:
 *                 type: string
 *                 example: H2
 *               produto:
 *                 type: string
 *                 example: H2O
 *               massaReagente:
 *                 type: number
 *                 example: 4.032
 *               molsReagente:
 *                 type: number
 *                 example: 2
 *             required:
 *               - equacao
 *               - reagente
 *               - produto
 *     responses:
 *       200:
 *         description: Massa teórica do produto
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/massa-teorica', controller.massaTeorica);

/**
 * @openapi
 * /estequiometria/reagente-limitante:
 *   post:
 *     tags: [Quimica]
 *     summary: Identifica o reagente limitante, reagentes em excesso e produtos gerados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equacao:
 *                 type: string
 *                 example: H2 + O2 -> H2O
 *               reagentes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     formula:
 *                       type: string
 *                     massa:
 *                       type: number
 *                     mols:
 *                       type: number
 *               produtoAlvo:
 *                 type: string
 *                 example: H2O
 *             required:
 *               - equacao
 *               - reagentes
 *     responses:
 *       200:
 *         description: Análise estequiométrica completa de limitante e excesso
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/reagente-limitante', controller.reagenteLimitante);

module.exports = router;
