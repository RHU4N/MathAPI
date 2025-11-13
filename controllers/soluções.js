const express = require('express');
const router = express.Router();

const SolucoesRepository = require('../infrastructure/repositories/SolucoesRepository');
const CalculateSolucoesUseCase = require('../domain/usecases/CalculateSolucoesUseCase');

const repo = new SolucoesRepository();
const usecase = new CalculateSolucoesUseCase(repo);

function mapErrorToResponse(error) {
    const msg = error && error.message ? String(error.message) : 'Erro interno no servidor';
    const lower = msg.toLowerCase();
    if (lower.includes('parâmetr') || lower.includes('obrig') || lower.includes('deve')) return { status: 400, msg };
    if (lower.includes('não') && lower.includes('encontr')) return { status: 404, msg };
    return { status: 500, msg: 'Erro interno no servidor' };
}

const handle = (action) => async (req, res) => {
    try {
        const result = await usecase.execute(action, req.body);
        return res.json(result);
    } catch (error) {
        const { status, msg } = mapErrorToResponse(error);
        return res.status(status).json({ error: msg });
    }
};

router.post('/concentracao-comum', handle('concentracao-comum'));
router.post('/molaridade', handle('molaridade'));
router.post('/molalidade', handle('molalidade'));
router.post('/fracao-molar', handle('fracao-molar'));
router.post('/densidade', handle('densidade'));

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
