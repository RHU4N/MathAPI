const express = require('express');
const router = express.Router();

const FinanceiroRepository = require('../infrastructure/repositories/FinanceiroRepository');
const CalculateFinanceiroUseCase = require('../domain/usecases/CalculateFinanceiroUseCase');

const repo = new FinanceiroRepository();
const usecase = new CalculateFinanceiroUseCase(repo);

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

router.post('/porcentagem', handle('porcentagem'));
router.post('/variacao-percentual', handle('variacao-porcentual'));
router.post('/juros/simples', handle('juros-simples'));
router.post('/juros/compostos', handle('juros-compostos'));

module.exports = router;