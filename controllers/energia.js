const express = require('express');
const router = express.Router();

const EnergiaRepository = require('../infrastructure/repositories/EnergiaRepository');
const CalculateEnergiaUseCase = require('../domain/usecases/CalculateEnergiaUseCase');

const repo = new EnergiaRepository();
const usecase = new CalculateEnergiaUseCase(repo);

function mapErrorToResponse(error) {
    const msg = error && error.message ? String(error.message) : 'Erro interno no servidor';
    const lower = msg.toLowerCase();
    if (lower.includes('parâmetr') || lower.includes('obrig') || lower.includes('deve')) return { status: 400, msg };
    if (lower.includes('não') && lower.includes('encontr')) return { status: 404, msg };
    return { status: 500, msg: 'Erro interno no servidor' };
}

const handle = (action) => async (req, res) => {
    try {
        const result = await usecase.execute(action, req.body);
        return res.json(result);
    } catch (error) {
        const { status, msg } = mapErrorToResponse(error);
        return res.status(status).json({ error: msg });
    }
};

router.post('/trabalho', handle('trabalho'));
router.post('/cinetica', handle('cinetica'));
router.post('/potencial-gravitacional', handle('potencial-gravitacional'));
router.post('/potencial-elastica', handle('potencial-elastica'));
router.post('/potencia', handle('potencia'));

module.exports = router;