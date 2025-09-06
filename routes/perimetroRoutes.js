const express = require('express');
const CalculatePerimetroUseCase = require('../domain/usecases/CalculatePerimetroUseCase');
const PerimetroRepository = require('../infrastructure/repositories/PerimetroRepository');

const router = express.Router();
const perimetroUseCase = new CalculatePerimetroUseCase();
const perimetroRepository = new PerimetroRepository();

router.post('/:forma', async (req, res) => {
    try {
        const { forma } = req.params;
        const dimensao = req.body;
        if (!forma || !dimensao) {
            return res.status(400).json({ error: 'Forma e dimensões são obrigatórias.' });
        }
        const perimetro = perimetroUseCase.execute(forma, dimensao);
        perimetroRepository.save({ forma, dimensao, perimetro });
        res.json({ forma, perimetro });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
