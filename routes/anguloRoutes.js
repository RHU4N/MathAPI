const express = require('express');
const CalculateAnguloUseCase = require('../domain/usecases/CalculateAnguloUseCase');
const AnguloRepository = require('../infrastructure/repositories/AnguloRepository');

const router = express.Router();
const anguloUseCase = new CalculateAnguloUseCase();
const anguloRepository = new AnguloRepository();

/**
 * @openapi
 * /angulo/{tipo}:
 *  post:
 *      summary: Realiza o cálculo para obter um ângulo
 *      description: Recebe o tipo de conversão de ângulo, retornando o resultado do cálculo.
 *      parameters:
 *          - name: tipo
 *            in: path
 *            required: true
 *            description: 'Tipo de conversão (ex: "radianosparagraus", "grauspararadianos").'
 *            schema: 
 *              type: string
 *              enum: [radianosparagraus, grauspararadianos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          valor:
 *                            type: number
 *                            description: Valor a ser convertido (em graus ou radianos, conforme o tipo)
 *                            example: 180
 *                          required:
 *                            - valor
 *      responses:
 *          200:
 *              description: Resultado da conversão.
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      tipo:
 *                        type: string
 *                        example: grauspararadianos
 *                      resultado:
 *                        type: number
 *                        example: 3.14159
 *          400:
 *              description: Erro de validação ou tipo inválido
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      error:
 *                        type: string
 *                        example: Tipo e valor são obrigatórios.
 */
router.post('/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;
        const { valor } = req.body;
        if (!tipo || valor === undefined) {
            return res.status(400).json({ error: 'Tipo e valor são obrigatórios.' });
        }
        const resultado = anguloUseCase.execute(tipo, valor);
        anguloRepository.save({ tipo, valor, resultado });
        res.json({ tipo, resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
