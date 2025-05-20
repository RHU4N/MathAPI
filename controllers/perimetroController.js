const express = require("express");
let Area = require("advanced-calculator");
const router = express.Router();

router.post("/:forma", async (req, res) => {
  try {
    const { forma } = req.params;
    const dimensao = req.body;

    if (!forma || !dimensao) {
      return res
        .status(400)
        .json({ error: "Forma e dimensões são obrigatórias." });
    }

    let result;
    switch (forma.toLowerCase()) {
      case "quadrado":
        result = 4 * dimensao.lado;
        break;
      case "retangulo":
        result = 2 * (dimensao.largura + dimensao.altura);
        break;
      case "circulo":
        result = 2 * Math.PI * dimensao.raio;
        break;
      case "triangulo":
        result = dimensao.lado1 + dimensao.lado2 + dimensao.lado3;
        break;
      case "trapezio":
        result =
          dimensao.baseMaior +
          dimensao.baseMenor +
          dimensao.lado1 +
          dimensao.lado2;
        break;
      case "losango":
        result = 4 * dimensao.lado;
        break;
      case "hexagono":
        result = 6 * dimensao.lado;
        break;
      default:
        return res
          .status(400)
          .json({ error: "Forma não suportada para cálculo do perímetro." });
    }

    res.json({ forma, perimetro: result });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao calcular a área.", details: error.message });
  }
});

module.exports = router;
