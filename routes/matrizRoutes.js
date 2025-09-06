const express = require('express');
const CalculateMatrizUseCase = require('../domain/usecases/CalculateMatrizUseCase');
const MatrizRepository = require('../infrastructure/repositories/MatrizRepository');

const router = express.Router();
const matrizUseCase = new CalculateMatrizUseCase();
const matrizRepository = new MatrizRepository();

router.post('/:operacao', async (req, res) => {
    try {
        const { operacao } = req.params;
        const { a, b } = req.body;
        if (!operacao || !a || !b) {
            return res.status(400).json({ error: 'Operação e matrizes são obrigatórias.' });
        }
        const matriz = matrizUseCase.execute(operacao, a, b);
        matrizRepository.save({ operacao, a, b, matriz });
        res.json({ operacao, matriz });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
