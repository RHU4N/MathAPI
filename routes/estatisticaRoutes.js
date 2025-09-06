const express = require('express');
const CalculateEstatisticaUseCase = require('../domain/usecases/CalculateEstatisticaUseCase');
const EstatisticaRepository = require('../infrastructure/repositories/EstatisticaRepository');

const router = express.Router();
const estatisticaUseCase = new CalculateEstatisticaUseCase();
const estatisticaRepository = new EstatisticaRepository();

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
