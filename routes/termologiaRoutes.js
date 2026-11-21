const express = require('express');
const controller = require('../controllers/termologiaController');

const router = express.Router();

/**
 * @openapi
 * /termologia/ponto-de-orvalho:
 *   post:
 *     tags: [Fisica]
 *     summary: Calcula o ponto de orvalho pela equação de Magnus-Tetens.
 *     description: Calcula Td a partir da temperatura (°C, domínio [-45, 60]) e umidade relativa (%, domínio (0, 100]).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperatura:
 *                 type: number
 *                 example: 24
 *               umidadeRelativa:
 *                 type: number
 *                 example: 40
 *               origem:
 *                 type: string
 *                 example: manual
 *             required:
 *               - temperatura
 *               - umidadeRelativa
 *     responses:
 *       200:
 *         description: Ponto de orvalho calculado e interpretação psicrométrica
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/ponto-de-orvalho', controller.pontoDeOrvalho);

module.exports = router;
