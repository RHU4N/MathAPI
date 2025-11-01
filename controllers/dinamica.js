const express = require('express');
const router = express.Router();

const DinamicaRepository = require('../infrastructure/repositories/DinamicaRepository');
const CalculateDinamicaUseCase = require('../domain/usecases/CalculateDinamicaUseCase');

const repo = new DinamicaRepository();
const usecase = new CalculateDinamicaUseCase(repo);

const handle = (action) => async (req, res) => {
    try {
        const result = await usecase.execute(action, req.body);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

router.post('/forca-resultante', handle('forca-resultante'));
router.post('/peso', handle('peso'));
router.post('/forca-atrito', handle('forca-atrito'));
router.post('/forca-elastica', handle('forca-elastica'));

module.exports = router;