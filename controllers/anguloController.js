// ANGULO

function determineDeg(x) {
    if (typeof x !== "number" || isNaN(x)) {
        throw new Error("O valor deve ser um número.");
    }
    return Math.abs(x) > 2 * Math.pi;
}

// Seno
function seno(ac, hipo) {
    try {
        if (typeof ac !== "number" || isNaN(ac)) {
            throw new Error("O ângulo ou cateto oposto deve ser um número.");
        }

        let sen;

        if (hipo == undefined) {
            if (determineDeg(ac)) {
                sen = Math.sin(ac * (Math.pi / 180));
            } else {
                sen = Math.sin(ac)
            }
        }
        else {
            if (typeof hipo !== "number" || isNaN(hipo || hipo <= 0)) {
                throw new Error("A hipotenusa deve ser um número positivo.");
            }
            if (ac > hipo) {
                throw new Error("O cateto oposto não pode ser maior que a hipotenusa.")
            }
            sen = ac / hipo;
        }

        return parseFloat(sen.toFixed(4));
    } catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}

// Cosseno
function cos(ac, hipo) {
    try {
        if (typeof ac !== "number" || isNaN(ac)) {
            throw new Error("O ângulo ou cateto adjacente deve ser um número.");
        }

        let cos;

        if (hipo == undefined) {
            if (determineDeg(ac)) {
                cos = Math.cos(ac * (Math.pi / 180));
            } else {
                cos = Math.cos(ac)
            }
        }
        else {
            if (typeof hipo !== "number" || isNaN(hipo || hipo <= 0)) {
                throw new Error("A hipotenusa deve ser um número positivo.");
            }
            if (ac > hipo) {
                throw new Error("O cateto adjacente não pode ser maior que a hipotenusa.")
            }
            cos = ac / hipo;
        }

        return parseFloat(cos.toFixed(4));
    } catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}

// tan
function tan(ac, adj) {
    try {
        // Verifica se 'ac' é um número válido
        if (typeof ac !== "number" || isNaN(ac)) {
            throw new Error("O ângulo ou cateto oposto deve ser um número.");
        }

        let tan;

        if (adj === undefined) {
            // Se 'ac' estiver em graus, converte para radianos
            if (determineDeg(ac)) {
                ac = ac * Math.pi / 180;
            }

            // Verifica se a tan é indefinida (ângulos de 90° ou 270°)
            if (Math.cos(ac) === 0) {
                throw new Error("A tangente é indefinida para este ângulo.");
            }

            tan = Math.tan(ac);
        } else {
            // Verifica se 'adj' é um número válido e positivo
            if (typeof adj !== "number" || isNaN(adj) || adj <= 0) {
                throw new Error("O cateto adjacente deve ser um número positivo.");
            }
            tan = ac / adj;
        }

        return parseFloat(tan.toFixed(4));
    } catch (error) {
        console.error("Erro:", error.message);
        return null; // Retorna null em caso de erro
    }
}




// TRIANGULO RETANGULO

//Pitágoras - Hipotenusa
function hipo(c1, c2) {
    try {
        // Verifica se c1 e c2 são números válidos
        if (typeof c1 !== "number" || isNaN(c1) || c1 <= 0) {
            throw new Error("O primeiro cateto deve ser um número positivo.");
        }
        if (typeof c2 !== "number" || isNaN(c2) || c2 <= 0) {
            throw new Error("O segundo cateto deve ser um número positivo.");
        }

        // Calcula a hipotenusa usando o Teorema de Pitágoras
        return Math.sqrt(c1 * c1 + c2 * c2);
    } catch (error) {
        console.error("Erro:", error.message);
        return null; // Retorna null em caso de erro
    }
}

//Pitágoras - Cateto
function cat(c, hipo) {
    try {
        // Verifica se c e hipo são números válidos
        if (typeof c !== "number" || isNaN(c) || c <= 0) {
            throw new Error("O cateto fornecido deve ser um número positivo.");
        }
        if (typeof hipo !== "number" || isNaN(hipo) || hipo <= 0) {
            throw new Error("A hipotenusa fornecida deve ser um número positivo.");
        }

        // Verifica se a hipotenusa é maior que o cateto
        if (hipo <= c) {
            throw new Error("A hipotenusa deve ser maior que o cateto.");
        }

        // Calcula o cateto usando o Teorema de Pitágoras
        return parseFloat(Math.sqrt(hipo * hipo - c * c).toFixed(4));
    } catch (error) {
        console.error("Erro:", error.message);
        return null; // Retorna null em caso de erro
    }
}

// angularController.js
const express = require('express');
const router = express.Router();

// Seno
router.post('/seno', (req, res) => {
    const { ac, hipo } = req.body;
    try {
        let sen;
        if (hipo === undefined) {
            sen = Math.sin(ac);
        } else {
            sen = ac / hipo;
        }
        return res.json({ resultado: parseFloat(sen.toFixed(4)) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Cosseno
router.post('/cosseno', (req, res) => {
    const { ac, hipo } = req.body;
    try {
        let cos;
        if (hipo === undefined) {
            cos = Math.cos(ac);
        } else {
            cos = ac / hipo;
        }
        return res.json({ resultado: parseFloat(cos.toFixed(4)) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Tangente
router.post('/tangente', (req, res) => {
    const { ac, adj } = req.body;
    try {
        let tan;
        if (adj === undefined) {
            tan = Math.tan(ac);
        } else {
            tan = ac / adj;
        }
        return res.json({ resultado: parseFloat(tan.toFixed(4)) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Pitágoras - Hipotenusa
router.post('/hipotenusa', (req, res) => {
    const { c1, c2 } = req.body;
    try {
        return res.json({ resultado: Math.sqrt(c1 * c1 + c2 * c2) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Pitágoras - Cateto
router.post('/cateto', (req, res) => {
    const { c, hipo } = req.body;
    try {
        return res.json({ resultado: parseFloat(Math.sqrt(hipo * hipo - c * c).toFixed(4)) });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;