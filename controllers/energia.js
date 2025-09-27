const express = require('express');
const router = express.Router();

//Trabalho
//T = F * d * cos(θ)
router.post('/trabalho', (req, res) => {
    const { F, d, angulo } = req.body;
    const resultado = `Trabalho = F * d * cos(θ) = ${F} * ${d} * cos(${angulo}) = ${F * d * Math.cos(angulo)}`;
    return res.json({ resultado });
});
//Energia cinética
//Ec = (m * v^2) / 2
router.post('/cinetica', (req, res) => {
    const { m, v } = req.body;
    const resultado = `Energia cinética = (m * v^2) / 2 = (${m} * ${v}^2) / 2 = ${(m * Math.pow(v, 2)) / 2}`;
    return res.json({ resultado });
});
//Energia potencial gravitacional
//Ep = m * g * h
router.post('/potencial-gravitacional', (req, res) => {
    const { m, h } = req.body;
    const g = 9.81; // Aceleração devido à gravidade
    const resultado = `Energia potencial gravitacional = m * g * h = ${m} * ${g} * ${h} = ${m * g * h}`;
    return res.json({ resultado });
});
//Energia potencial elástica
//Ep = (k * x^2) / 2
router.post('/potencial-elastica', (req, res) => {
    const { k, x } = req.body;
    const resultado = `Energia potencial elástica = (k * x^2) / 2 = (${k} * ${x}^2) / 2 = ${(k * Math.pow(x, 2)) / 2}`;
    return res.json({ resultado });
});
//Potência
//P = T / Δt
router.post('/potencia', (req, res) => {
    const { T, s0, sf } = req.body;
    const deltaT = sf - s0;
    const resultado = `Potência = T / Δt = ${T} / ${deltaT} = ${T / deltaT}`;
    return res.json({ resultado });
});

module.exports = router;