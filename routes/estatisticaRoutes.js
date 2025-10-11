const express = require('express');
const CalculateEstatisticaUseCase = require('../domain/usecases/CalculateEstatisticaUseCase');
const EstatisticaRepository = require('../infrastructure/repositories/EstatisticaRepository');

const router = express.Router();
const estatisticaUseCase = new CalculateEstatisticaUseCase();
const estatisticaRepository = new EstatisticaRepository();

/**
 * @openapi
 * /estatistica/{tipo}:
 *  post:
 *      summary: Recebe o tipo de operação de estatística e um array de valores númericos.
 *      description: >
 *        Recebe o tipo de operação de estatística e um array de valores númericos.
 *        Tipo aceitos incluem:
 *        - `"media"`: calcula a média aritmética
 *        - `"mediana"`: calcula a mediana
 *      parameters:
 *          - name: tipo
 *            in: path
 *            required: true
 *            description: 'Tipo de operação (ex: "média", "mediana").'
 *            schema: 
 *              type: string
 *              enum: [media, mediana]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                          valores:
 *                            type: array
 *                            description: Lista de valores númericos usados no cálculo
 *                            example: [10, 20, 30, 40, 50]
 *                          required:
 *                            - valores
 *      responses:
 *          200:
 *              description: Resultado do cálculo estatístico.
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      tipo:
 *                        type: string
 *                        example: media
 *                      resultado:
 *                        type: number
 *                        example: 30
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
        const { valores } = req.body;
        if (!tipo || !valores) {
            return res.status(400).json({ error: 'Tipo e valores são obrigatórios.' });
        }
        const resultado = estatisticaUseCase.execute(tipo, valores);
        estatisticaRepository.save({ tipo, valores, resultado });
        res.json({ tipo, resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
