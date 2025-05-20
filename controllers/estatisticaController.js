//***ESTATISTICA***

const express = require('express');
const router = express.Router();

// Média
router.post('/media', (req, res) => {
    const { numeros } = req.body;
    try {
        if (!Array.isArray(numeros) || numeros.length === 0) {
            throw new Error("É necessário fornecer um array de números.");
        }
        const soma = numeros.reduce((a, b) => a + b, 0);
        const media = soma / numeros.length;
        return res.json({ resultado: parseFloat(media.toFixed(2)) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Mediana
router.post('/mediana', (req, res) => {
    const { numeros } = req.body;
    try {
        if (!Array.isArray(numeros) || numeros.length === 0) {
            throw new Error("É necessário fornecer um array de números.");
        }
        const nums = [...numeros].sort((a, b) => a - b);
        let mediana;
        if (nums.length % 2 === 0) {
            mediana = (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2;
        } else {
            mediana = nums[Math.floor(nums.length / 2)];
        }
        return res.json({ resultado: mediana });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Moda
router.post('/moda', (req, res) => {
    const { numeros } = req.body;
    try {
        if (!Array.isArray(numeros) || numeros.length === 0) {
            throw new Error("É necessário fornecer um array de números.");
        }
        const freq = {};
        numeros.forEach(num => { freq[num] = (freq[num] || 0) + 1; });
        const maxFreq = Math.max(...Object.values(freq));
        const moda = Object.keys(freq).filter(num => freq[num] === maxFreq).map(Number);
        return res.json({ resultado: moda });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;