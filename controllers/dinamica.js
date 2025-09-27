const express = require('express');
const router = express.Router();

//Força resultante: F = m * a
router.post('/forca-resultante', (req, res) => {
    const { m, a } = req.body;
    const resultado = `Força resultante = m * a = ${m} * ${a} = ${m * a}`;
    return res.json({ resultado });
});

//Peso: P = m * g
router.post('/peso', (req, res) => {
    const { m } = req.body;
    const resultado = `Peso = m * g = ${m} * 9.81 = ${m * 9.81}`;
    return res.json({ resultado });
});

//Força de atrito: Fat = μ * N
router.post('/forca-atrito', (req, res) => {
    const { mu, N } = req.body;
    const resultado = `Força de atrito = μ * N = ${mu} * ${N} = ${mu * N}`;
    return res.json({ resultado });
});

//Força elastica: Fe = k * x
router.post('/forca-elastica', (req, res) => {
    const { k, x } = req.body;
    const resultado = `Força elástica = k * x = ${k} * ${x} = ${k * x}`;
    return res.json({ resultado });
});

module.exports = router;