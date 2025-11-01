const express = require('express');
const router = express.Router();

const CineticaRepository = require('../infrastructure/repositories/CineticaRepository');
const CalculateCineticaUseCase = require('../domain/usecases/CalculateCineticaUseCase');

const repo = new CineticaRepository();
const usecase = new CalculateCineticaUseCase(repo);

const handle = (action) => async (req, res) => {
    try {
        const result = await usecase.execute(action, req.body);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

router.post('/velocidade', handle('velocidade'));
router.post('/aceleracao', handle('aceleracao'));
router.post('/mru', handle('mru'));
router.post('/mruv/posicao', handle('mruv-posicao'));
router.post('/mruv/velocidade', handle('mruv-velocidade'));
router.post('/torricelli', handle('torricelli'));
router.post('/mcu/velocidade-angular', handle('mcu-velocidade-angular'));
router.post('/mcu/velocidade-linear', handle('mcu-velocidade-linear'));
router.post('/lancamento-obliquo/velocidade', handle('lancamento-velocidade'));
router.post('/lancamento-obliquo/alcance', handle('lancamento-alcance'));
router.post('/lancamento-obliquo/altura-maxima', handle('lancamento-altura-maxima'));
router.post('/lancamento-obliquo/tempo-voo', handle('lancamento-tempo-voo'));

module.exports = router;