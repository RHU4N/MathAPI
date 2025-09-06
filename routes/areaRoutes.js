const express = require('express');
const CalculateAreaUseCase = require('../domain/usecases/CalculateAreaUseCase');
const AreaRepository = require('../infrastructure/repositories/AreaRepository');

const router = express.Router();
const areaUseCase = new CalculateAreaUseCase();
const areaRepository = new AreaRepository();

router.post('/:forma', async (req, res) => {
    try {
        const { forma } = req.params;
        const dimensao = req.body;
        if (!forma || !dimensao) {
            return res.status(400).json({ error: 'Forma e dimensões são obrigatórias.' });
        }
        const area = areaUseCase.execute(forma, dimensao);
        areaRepository.save({ forma, dimensao, area }); // Exemplo de uso do repositório
        res.json({ forma, area });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
