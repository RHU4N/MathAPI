const express = require('express');
const router = express.Router();

// Permutação
router.post('/permutacao', (req, res) => {
    const { n, k } = req.body;
    try {
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n < 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro não negativo.");
        }
        if (k !== undefined) {
            if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
                throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
            }
            if (k > n) {
                throw new Error("O valor de 'k' não pode ser maior que 'n'.");
            }
            let resultado = 1;
            for (let i = n; i > n - k; i--) resultado *= i;
            return res.json({ resultado });
        } else {
            let resultado = 1;
            for (let i = 2; i <= n; i++) resultado *= i;
            return res.json({ resultado });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Combinação
router.post('/combinacao', (req, res) => {
    const { n, k } = req.body;
    try {
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n < 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro não negativo.");
        }
        if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
            throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
        }
        if (k > n) {
            throw new Error("O valor de 'k' não pode ser maior que 'n'.");
        }
        let f = x => { let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; };
        let resultado = f(n) / (f(k) * f(n - k));
        return res.json({ resultado });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Arranjo
router.post('/arranjo', (req, res) => {
    const { n, k } = req.body;
    try {
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n < 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro não negativo.");
        }
        if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
            throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
        }
        if (k > n) {
            throw new Error("O valor de 'k' não pode ser maior que 'n'.");
        }
        let f = x => { let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; };
        let resultado = f(n) / f(n - k);
        return res.json({ resultado });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Arranjo com repetição
router.post('/arranjoRep', (req, res) => {
    const { n, k } = req.body;
    try {
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n <= 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro positivo.");
        }
        if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
            throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
        }
        let resultado = Math.pow(n, k);
        return res.json({ resultado });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;