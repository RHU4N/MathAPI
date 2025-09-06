const express = require('express');
const CalculateVolumeUseCase = require('../domain/usecases/CalculateVolumeUseCase');
const VolumeRepository = require('../infrastructure/repositories/VolumeRepository');

const router = express.Router();
const volumeUseCase = new CalculateVolumeUseCase();
const volumeRepository = new VolumeRepository();

router.post('/:forma', async (req, res) => {
    try {
        const { forma } = req.params;
        const dimensao = req.body;
        if (!forma || !dimensao) {
            return res.status(400).json({ error: 'Forma e dimensões são obrigatórias.' });
        }
        const volume = volumeUseCase.execute(forma, dimensao);
        volumeRepository.save({ forma, dimensao, volume });
        res.json({ forma, volume });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
