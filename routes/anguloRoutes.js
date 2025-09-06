const express = require('express');
const CalculateAnguloUseCase = require('../domain/usecases/CalculateAnguloUseCase');
const AnguloRepository = require('../infrastructure/repositories/AnguloRepository');

const router = express.Router();
const anguloUseCase = new CalculateAnguloUseCase();
const anguloRepository = new AnguloRepository();

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
