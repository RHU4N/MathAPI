const express = require('express');
const router = express.Router();

const DinamicaRepository = require('../infrastructure/repositories/DinamicaRepository');
const CalculateDinamicaUseCase = require('../domain/usecases/CalculateDinamicaUseCase');

const repo = new DinamicaRepository();
const usecase = new CalculateDinamicaUseCase(repo);

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

router.post('/forca-resultante', handle('forca-resultante'));
router.post('/peso', handle('peso'));
router.post('/forca-atrito', handle('forca-atrito'));
router.post('/forca-elastica', handle('forca-elastica'));

module.exports = router;