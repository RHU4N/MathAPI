const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

function handleValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
}

// Trabalho: T = F * d * cos(θ)
router.post(
    '/trabalho',
    [body('F').exists().isNumeric(), body('d').exists().isNumeric(), body('angulo').exists().isNumeric()],
    (req, res, next) => {
        const validationError = handleValidation(req, res);
        if (validationError) return validationError;
        try {
            const F = Number(req.body.F);
            const d = Number(req.body.d);
            const angulo = Number(req.body.angulo);
            const result = F * d * Math.cos(angulo);
            return res.json({ success: true, formula: 'T = F * d * cos(θ)', result, inputs: { F, d, angulo } });
        } catch (err) {
            return next(err);
        }
    }
);

// Energia cinética: Ec = (m * v^2) / 2
router.post(
    '/cinetica',
    [body('m').exists().isNumeric(), body('v').exists().isNumeric()],
    (req, res, next) => {
        const validationError = handleValidation(req, res);
        if (validationError) return validationError;
        try {
            const m = Number(req.body.m);
            const v = Number(req.body.v);
            const result = (m * Math.pow(v, 2)) / 2;
            return res.json({ success: true, formula: 'Ec = (m * v^2) / 2', result, inputs: { m, v } });
        } catch (err) {
            return next(err);
        }
    }
);

// Energia potencial gravitacional: Ep = m * g * h
router.post(
    '/potencial-gravitacional',
    [body('m').exists().isNumeric(), body('h').exists().isNumeric(), body('g').optional().isNumeric()],
    (req, res, next) => {
        const validationError = handleValidation(req, res);
        if (validationError) return validationError;
        try {
            const m = Number(req.body.m);
            const h = Number(req.body.h);
            const g = req.body.g !== undefined ? Number(req.body.g) : 9.81;
            const result = m * g * h;
            return res.json({ success: true, formula: 'Ep = m * g * h', result, inputs: { m, h, g } });
        } catch (err) {
            return next(err);
        }
    }
);

// Energia potencial elástica: Ep = (k * x^2) / 2
router.post(
    '/potencial-elastica',
    [body('k').exists().isNumeric(), body('x').exists().isNumeric()],
    (req, res, next) => {
        const validationError = handleValidation(req, res);
        if (validationError) return validationError;
        try {
            const k = Number(req.body.k);
            const x = Number(req.body.x);
            const result = (k * Math.pow(x, 2)) / 2;
            return res.json({ success: true, formula: 'Ep = (k * x^2) / 2', result, inputs: { k, x } });
        } catch (err) {
            return next(err);
        }
    }
);

// Potência: P = T / Δt
router.post(
    '/potencia',
    [body('T').exists().isNumeric(), body('s0').exists().isNumeric(), body('sf').exists().isNumeric()],
    (req, res, next) => {
        const validationError = handleValidation(req, res);
        if (validationError) return validationError;
        try {
            const T = Number(req.body.T);
            const s0 = Number(req.body.s0);
            const sf = Number(req.body.sf);
            const deltaT = sf - s0;
            const result = T / deltaT;
            return res.json({ success: true, formula: 'P = T / Δt', result, inputs: { T, s0, sf } });
        } catch (err) {
            return next(err);
        }
    }
);

module.exports = router;