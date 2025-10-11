const express = require('express');

// This module exports a factory: (deps) => router
// deps: { useCase, repository }

const CalculateAnguloUseCase = require('../domain/usecases/CalculateAnguloUseCase');
const AnguloRepository = require('../infrastructure/repositories/AnguloRepository');

function createAnguloRouter(deps = {}) {
    const router = express.Router();
    const anguloUseCase = deps.useCase || new CalculateAnguloUseCase();
    const anguloRepository = deps.repository || new AnguloRepository();

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
        
        if (typeof valor !== 'number') {
            return res.status(422).json({ error: 'O campo valor deve ser um número.' });
        }
        const resultado = anguloUseCase.execute(tipo, valor);
        anguloRepository.save({ tipo, valor, resultado });
        res.json({ tipo, resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

    return router;
}

// Backward compatibility: module can be required as the router directly
// e.g. app.use('/angulo', require('./routes/anguloRoutes'))
// so also export a default router instance
const defaultRouter = createAnguloRouter();
module.exports = function(opts) {
    // If callers pass an express app or call as factory, return factory result
    if (opts && typeof opts === 'object') return createAnguloRouter(opts);
    return defaultRouter;
};
