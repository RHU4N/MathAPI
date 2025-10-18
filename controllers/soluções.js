const express = require('express');
const router = express.Router();

//Concentração comum
router.post('/concentracao-comum', (req, res) => {
    const { soluto, volume } = req.body;
    const resultado = `Concentração comum = soluto / volume = ${soluto} / ${volume} = ${soluto / volume} g/L`;
    return res.json({ resultado });
}
);
//Molaridade
router.post('/molaridade', (req, res) => {
    const { soluto, volume } = req.body;
    const resultado = `Molaridade = soluto / volume = ${soluto} / ${volume} = ${soluto / volume} mol/L`;
    return res.json({ resultado });
});

//Molalidade
router.post('/molalidade', (req, res) => {
    const { soluto, solvente } = req.body;
    const resultado = `Molalidade = soluto / solvente = ${soluto} / ${solvente} = ${soluto / solvente} mol/kg`;
    return res.json({ resultado });
});

//Fraçao molar
router.post('/fracao-molar', (req, res) => {
    const { n1, n2 } = req.body;
    const resultado = `Fraçao molar = n1 / (n1 + n2) = ${n1} / (${n1} + ${n2}) = ${n1 / (n1 + n2)}`;
    return res.json({ resultado });
});

//Densidade
router.post('/densidade', (req, res) => {
    const { massa, volume } = req.body;
    const resultado = `Densidade = massa / volume = ${massa} / ${volume} = ${massa / volume} g/mL`;
    return res.json({ resultado });
});

/**
 * @openapi
 * /solucoes/concentracao-comum:
 * post:
 *      tags: [Soluções]
 *      summary: Calcula a concentração comum de uma solução.
 *      description: Recebe a quantidade de soluto (em gramas) e o volume da solução (em litros), retornando a concentração comum em g/L.
 *      parameters:
 *          - name: tipo
 *            in: path
 *            required: true
 *            description: 'Concentração comum.'
 *            schema: 
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *             application/json:
 *                 schema:
 *                      type: object
 *                      properties:
 *                         soluto:
 *                              type: integer
 *                              example: 10
 *                          volume:
 *                              type: integer
 *                              example: 2
 *                          required:
 *                              - soluto
 *                              - volume
 *     responses:
 *        200:
 *              description: Resultado do cálculo.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             resultado:
 *                                  type: string
 *                                  example: Concentração comum = soluto / volume = 10 / 2 = 5 g/L
 *       400:
 *              description: Falta de parâmetros obrigatórios.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  example: Parâmetros soluto e volume são obrigatórios.
 * 
 */

/**
 * @openapi
 * /solucoes/molaridade:
 *  post:
 *      tags: [Soluções]
 *      summary: Calcula a molaridade de uma solução.
 *      description: Recebe a quantidade de soluto (em mols) e o volume da solução (em litros), retornando a molaridade em mol/L.
 *      parameters:
 *         - name: tipo
 *           in: path
 *           required: true
 *           description: 'Molaridade.'
 *          schema:
 *            type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *                soluto:
 *                   type: integer
 *                   example: 3
 *               volume:
 *                  type: integer
 *                  example: 1
 *              required:
 *                - soluto
 *                - volume
 *    responses:
 *      200:
 *         description: Resultado do cálculo.
 *         content:
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *              resultado:
 *               type: string
 *               example: Molaridade = soluto / volume = 3 / 1 = 3 mol/L
 *     400:
 *        description: Falta de parâmetros obrigatórios.
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            error:
 *             type: string
 *             example: Parâmetros soluto e volume são obrigatórios.
 */

/**
 * @openapi
 * /solucoes/molalidade:
 *  post:
 *      tags: [Soluções]
 *      summary: Calcula a molalidade de uma solução.
 *      description: Recebe a quantidade de soluto (em mols) e a massa do solvente (em kg), retornando a molalidade em mol/kg.
 *      parameters:
 *        - name: tipo
 *          in: path
 *         required: true
 *         description: 'Molalidade.'
 *         schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *       schema:
 *        type: object
 *        properties:
 *         soluto:
 *          type: integer
 *          example: 2
 *         solvente:
 *          type: integer
 *          example: 0.5
 *     required:
 *      - soluto
 *      - solvente
 *   responses:
 *    200:
 *     description: Resultado do cálculo.
 *     content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        resultado:
 *         type: string
 *         example: Molalidade = soluto / solvente = 2 / 0.5 = 4 mol/kg
 *   400:
 *    description: Falta de parâmetros obrigatórios.
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *      error:
 *       type: string
 *       example: Parâmetros soluto e solvente são obrigatórios.
 * 
 */
/**
 * @openapi
 * /solucoes/fracao-molar:
 *  post:
 *      tags: [Soluções]
 *      summary: Calcula a proporção de cada componente em uma mistura.
 *      description: Recebe a quantidade de mols de dois componentes (n1 e n2), retornando a fração molar do primeiro componente.
 *      parameters:
 *        - name: tipo
 *          in: path
 *         required: true
 *         description: 'Fração Molar.'
 *         schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *       schema:
 *        type: object
 *        properties:
 *         n1:
 *          type: integer
 *          example: 2
 *         n2:
 *          type: integer
 *          example: 3
 *     required:
 *      - n1
 *      - n2
 *   responses:
 *    200:
 *     description: Resultado do cálculo.
 *     content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        resultado:
 *         type: string
 *         example: Fraçao molar = n1 / (n1 + n2) = 2 / (2 + 3) = 0.4
 *   400:
 *    description: Falta de parâmetros obrigatórios.
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *      error:
 *       type: string
 *       example: Parâmetros soluto e solvente são obrigatórios.
 * 
 */

/**
 * @openapi
 * /solucoes/densidade:
 *  post:
 *      tags: [Soluções]
 *      summary: Calcula a densidade de uma substância.
 *      description: Recebe a massa (em gramas) e o volume (em mililitros), retornando a densidade em g/mL.
 *      parameters:
 *        - name: tipo
 *          in: path
 *         required: true
 *         description: 'Densidade.'
 *         schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *       schema:
 *        type: object
 *        properties:
 *         massa:
 *          type: integer
 *          example: 10
 *         volume:
 *          type: integer
 *          example: 5
 *     required:
 *      - massa
 *      - volume
 *   responses:
 *    200:
 *     description: Resultado do cálculo.
 *     content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        resultado:
 *         type: string
 *         example: Densidade = massa / volume = 10 / 5 = 2 g/mL
 *   400:
 *    description: Falta de parâmetros obrigatórios.
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *      error:
 *       type: string
 *       example: Parâmetros soluto e solvente são obrigatórios.
 * 
 */
module.exports = router;
