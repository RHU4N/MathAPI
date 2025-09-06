const express = require('express');
const CalculateFuncaoUseCase = require('../domain/usecases/CalculateFuncaoUseCase');
const FuncaoRepository = require('../infrastructure/repositories/FuncaoRepository');

const router = express.Router();
const funcaoUseCase = new CalculateFuncaoUseCase();
const funcaoRepository = new FuncaoRepository();

router.post('/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;
        const params = req.body;
        if (!tipo || !params) {
            return res.status(400).json({ error: 'Tipo e parâmetros são obrigatórios.' });
        }
        const resultado = funcaoUseCase.execute(tipo, params);
        funcaoRepository.save({ tipo, params, resultado });
        res.json({ tipo, resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
