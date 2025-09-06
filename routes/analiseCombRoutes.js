const express = require('express');
const CalculateAnaliseCombUseCase = require('../domain/usecases/CalculateAnaliseCombUseCase');
const AnaliseCombRepository = require('../infrastructure/repositories/AnaliseCombRepository');

const router = express.Router();
const analiseUseCase = new CalculateAnaliseCombUseCase();
const analiseRepository = new AnaliseCombRepository();

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
