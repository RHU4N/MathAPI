const express = require('express');
const router = express.Router();

const CineticaRepository = require('../infrastructure/repositories/CineticaRepository');
const CalculateCineticaUseCase = require('../domain/usecases/CalculateCineticaUseCase');

const repo = new CineticaRepository();
const usecase = new CalculateCineticaUseCase(repo);

function mapErrorToResponse(error) {
    const msg = error && error.message ? String(error.message) : 'Erro interno no servidor';
    const lower = msg.toLowerCase();
    if (lower.includes('parâmetr') || lower.includes('obrig') || lower.includes('deve')) return { status: 400, msg };
    if (lower.includes('não') && lower.includes('encontr')) return { status: 404, msg };
    return { status: 500, msg: 'Erro interno no servidor' };
}

const handle = (action) => async (req, res) => {
    try {
        // basic required-params validation per action
        const required = {
            velocidade: ['s0','sf','t0','tf'],
            aceleracao: ['v0','vf','t0','tf'],
            mru: ['s0','v','t'],
            'mruv-posicao': ['s0','v0','a','t'],
            'mruv-velocidade': ['v0','a','t'],
            torricelli: ['v0','a','s','s0'],
            'mcu-velocidade-angular': ['periodo'],
            'mcu-velocidade-linear': ['omega','raio'],
            'lancamento-velocidade': ['v0','angulo','t'],
            'lancamento-alcance': ['v0','angulo'],
            'lancamento-altura-maxima': ['v0','angulo'],
            'lancamento-tempo-voo': ['v0','angulo']
        }[action];
        if (required) {
            const missing = required.filter(k => req.body[k] === undefined || typeof req.body[k] !== 'number');
            if (missing.length) throw new Error('Parâmetros obrigatórios faltando: ' + missing.join(', '));
        }
        const result = await usecase.execute(action, req.body);
        return res.json(result);
    } catch (error) {
        const { status, msg } = mapErrorToResponse(error);
        return res.status(status).json({ error: msg });
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