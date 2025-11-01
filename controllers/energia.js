const express = require('express');
const router = express.Router();

const EnergiaRepository = require('../infrastructure/repositories/EnergiaRepository');
const CalculateEnergiaUseCase = require('../domain/usecases/CalculateEnergiaUseCase');

const repo = new EnergiaRepository();
const usecase = new CalculateEnergiaUseCase(repo);

const handle = (action) => async (req, res) => {
    try {
        const result = await usecase.execute(action, req.body);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

router.post('/trabalho', handle('trabalho'));
router.post('/cinetica', handle('cinetica'));
router.post('/potencial-gravitacional', handle('potencial-gravitacional'));
router.post('/potencial-elastica', handle('potencial-elastica'));
router.post('/potencia', handle('potencia'));

module.exports = router;