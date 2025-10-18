const express = require('express');
const CalculateAnaliseCombUseCase = require('../domain/usecases/CalculateAnaliseCombUseCase');
const AnaliseCombRepository = require('../infrastructure/repositories/AnaliseCombRepository');

const router = express.Router();
const analiseUseCase = new CalculateAnaliseCombUseCase();
const analiseRepository = new AnaliseCombRepository();

/**
 * @openapi
 * /analise/{tipo}:
 *  post:
 *      tags: [Matematica]
 *      summary: Realiza o cálculo de análise combinatória
 *      description: Recebe o tipo de análise combinatória e os parâmetros necessários, retornando o resultado do cálculo.
 *      parameters:
 *          - name: tipo
 *            in: path
 *            required: true
 *            description: 'Tipo de análise combinatória (ex: "arranjo", "combinacao", "permutacao").'
 *            schema: 
 *              type: string
 *              enum: [arranjo, combinacao, permutacao]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          n:
 *                            type: integer
 *                            example: 5
 *                          k: 
 *                            type: integer
 *                            example: 3
 *                          required:
 *                            - n
 *                            - k
 *      responses:
 *          200:
 *              description: Resultado do cálculo.
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      tipo:
 *                        type: string
 *                        example: combinacao
 *                      resultado:
 *                        type: number
 *                        example: 10
 *          400:
 *              description: Erro de validação ou tipo inválido
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      error:
 *                        type: string
 *                        example: Tipo e parâmetros são obrigatórios.
 */
router.post('/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;
        const params = req.body;
        if (!tipo || !params) {
            return res.status(400).json({ error: 'Tipo e parâmetros são obrigatórios.' });
        }
        const resultado = analiseUseCase.execute(tipo, params);
        analiseRepository.save({ tipo, params, resultado });
        res.json({ tipo, resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
