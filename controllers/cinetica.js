const express = require('express');
const router = express.Router();

// Velocidade média: v = Δs / Δt
router.post('/velocidade', (req, res) => {
    const { s0, sf, t0, tf } = req.body;
    const deltaS = sf - s0;
    const deltaT = tf - t0;
    const resultado = `Velocidade média = Δs / Δt = ${deltaS} / ${deltaT} = ${deltaS / deltaT}`;
    return res.json({ resultado });
});

// Aceleração média: a = Δv / Δt
router.post('/aceleracao', (req, res) => {
    const { v0, vf, t0, tf } = req.body;
    const deltaV = vf - v0;
    const deltaT = tf - t0;
    const resultado = `Aceleração média = Δv / Δt = ${deltaV} / ${deltaT} = ${deltaV / deltaT}`;
    return res.json({ resultado });
});

// Movimento Retilíneo Uniforme (MRU): s = s0 + v * t
router.post('/mru', (req, res) => {
    const { s0, v, t } = req.body;
    const resultado = `Posição final (MRU) = s0 + v * t = ${s0} + ${v} * ${t} = ${s0 + v * t}`;
    return res.json({ resultado });
});

// Movimento Retilíneo Uniformemente Variado (MRUV)
// Função horária da posição: s = s0 + v0 * t + (a * t^2) / 2
router.post('/mruv/posicao', (req, res) => {
    const { s0, v0, a, t } = req.body;
    const resultado = `Posição final (MRUV) = s0 + v0 * t + (a * t^2) / 2 = ${s0} + ${v0} * ${t} + (${a} * ${t}^2) / 2 = ${s0 + v0 * t + (a * Math.pow(t, 2)) / 2}`;
    return res.json({ resultado });
});

// Função horária da velocidade: v = v0 + a * t
router.post('/mruv/velocidade', (req, res) => {
    const { v0, a, t } = req.body;
    const resultado = `Velocidade final (MRUV) = v0 + a * t = ${v0} + ${a} * ${t} = ${v0 + a * t}`;
    return res.json({ resultado });
});

// Equação de Torricelli: v^2 = v0^2 + 2 * a * (s - s0)
router.post('/torricelli', (req, res) => {
    const { v0, a, s, s0 } = req.body;
    const resultado = `Velocidade final (Torricelli): v^2 = v0^2 + 2 * a * (s - s0) = ${v0}^2 + 2 * ${a} * (${s} - ${s0}) = ${Math.sqrt(Math.pow(v0, 2) + 2 * a * (s - s0))} (após raiz quadrada)`;
    return res.json({ resultado });
});

// Movimento Circular Uniforme (MCU)
// Velocidade angular: ω = 2π / T
router.post('/mcu/velocidade-angular', (req, res) => {
    const { periodo } = req.body;
    const resultado = `Velocidade angular = 2π / T = 2 * ${Math.PI.toFixed(2)} / ${periodo} = ${(2 * Math.PI / periodo)}`;
    return res.json({ resultado });
});

// Velocidade linear: v = ω * r
router.post('/mcu/velocidade-linear', (req, res) => {
    const { omega, raio } = req.body;
    const resultado = `Velocidade linear = ω * r = ${omega} * ${raio} = ${omega * raio}`;
    return res.json({ resultado });
});

// Lançamento Oblíquo
//Velocidade x e y: vx = v0 * cos(θ), vy = v0 * sin(θ)
router.post('/lancamento-obliquo/velocidade', (req, res) => {
    const { v0, angulo, t } = req.body;
    const vx = v0 * Math.cos(angulo);
    const vy = v0 * Math.sin(angulo) - 9.81 * t;
    const resultado = `Velocidade x = v0 * cos(θ) = ${v0} * cos(${angulo}) = ${vx}, Velocidade y = v0 * sin(θ) - g * t = ${v0} * sin(${angulo}) - 9.81 * ${t} = ${vy}`;
    return res.json({ resultado });
});

// Alcance: R = (v0^2 * sin(2θ)) / g
router.post('/lancamento-obliquo/alcance', (req, res) => {
    const { v0, angulo, g = 9.81 } = req.body;
    const resultado = `Alcance = (v0^2 * sin(2θ)) / g = (${v0}^2 * sin(2 * ${angulo})) / ${g} = ${(Math.pow(v0, 2) * Math.sin(2 * angulo)) / g}`;
    return res.json({ resultado });
});

// Altura máxima: H = (v0^2 * sin^2(θ)) / (2g)
router.post('/lancamento-obliquo/altura-maxima', (req, res) => {
    const { v0, angulo, g = 9.81 } = req.body;
    const resultado = `Altura máxima = (v0^2 * sin^2(θ)) / (2g) = (${v0}^2 * sin^2(${angulo})) / (2 * ${g}) = ${(Math.pow(v0, 2) * Math.pow(Math.sin(angulo), 2)) / (2 * g)}`;
    return res.json({ resultado });
});

// Tempo de voo: T = (2 * v0 * sin(θ)) / g
router.post('/lancamento-obliquo/tempo-voo', (req, res) => {
    const { v0, angulo, g = 9.81 } = req.body;
    const resultado = `Tempo de voo = (2 * v0 * sin(θ)) / g = (2 * ${v0} * sin(${angulo})) / ${g} = ${(2 * v0 * Math.sin(angulo)) / g}`;
    return res.json({ resultado });
});

module.exports = router;