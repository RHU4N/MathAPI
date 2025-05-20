const express = require('express');
const router = express.Router();

// Função do 1º grau: f(x) = a*x + b
router.post('/funcao1', (req, res) => {
    const { a, b, x } = req.body;
    try {
        if (typeof a != "number" || isNaN(a)){
            throw new Error("O valor de 'a' deve ser um número.");
        }
        if (typeof b != "number" || isNaN(b)){
            throw new Error("O valor de 'b' deve ser um número.");
        }
        if (typeof x != "number" || isNaN(x)){
            throw new Error("O valor de 'x' deve ser um número.");
        }
        return res.json({ resultado: a * x + b });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Função do 2º grau: f(x) = a*x^2 + b*x + c ou raízes
router.post('/funcao2', (req, res) => {
    const { a, b, c, x } = req.body;
    try {
        if (typeof a !== "number" || isNaN(a)) {
            throw new Error("O valor de 'a' deve ser um número.");
        }
        if (typeof b !== "number" || isNaN(b)) {
            throw new Error("O valor de 'b' deve ser um número.");
        }
        if (typeof c !== "number" || isNaN(c)) {
            throw new Error("O valor de 'c' deve ser um número.");
        }
        if(x !== undefined){
            if (typeof x !== "number" || isNaN(x)) {
                throw new Error("O valor de 'x' deve ser um número.");
            }
            return res.json({ resultado: a * (x * x) + b * x + c });
        } else {
            let delta = b * b - 4 * a * c;
            if (delta < 0){
                throw new Error("Não existem raízes reais, delta é negativo.");
            }
            let xNeg = (-b - Math.sqrt(delta)) / (2 * a);
            let xPos = (-b + Math.sqrt(delta)) / (2 * a);
            return res.json({ resultado: [xNeg, xPos] });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;