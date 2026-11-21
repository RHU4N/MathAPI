const { Fraction, gcd, lcm } = require('./rational');
const { parseEquationSide, calculateMolarMass } = require('./formulaParser');
const { ValidationError } = require('../../../../utils/calculationHelpers');

/**
 * Executa eliminação de Gauss-Jordan exata (RREF) em matriz de Fraction.
 */
function computeRref(matrix, numRows, numCols) {
    const work = matrix.map((row) => row.map((cell) => Fraction.from(cell)));
    const pivotCols = [];
    let pivotRow = 0;

    for (let col = 0; col < numCols && pivotRow < numRows; col += 1) {
        let found = -1;
        for (let r = pivotRow; r < numRows; r += 1) {
            if (!work[r][col].isZero()) {
                found = r;
                break;
            }
        }
        if (found === -1) continue;

        if (found !== pivotRow) {
            const tmp = work[pivotRow];
            work[pivotRow] = work[found];
            work[found] = tmp;
        }

        const pivotVal = work[pivotRow][col];
        for (let c = col; c < numCols; c += 1) {
            work[pivotRow][c] = work[pivotRow][c].div(pivotVal);
        }

        for (let r = 0; r < numRows; r += 1) {
            if (r === pivotRow || work[r][col].isZero()) continue;
            const factor = work[r][col];
            for (let c = col; c < numCols; c += 1) {
                work[r][c] = work[r][c].sub(factor.mul(work[pivotRow][c]));
            }
        }

        pivotCols.push(col);
        pivotRow += 1;
    }

    return { rref: work, pivotCols };
}

function formatSpeciesTerm(coeficiente, formula) {
    return coeficiente === 1 ? formula : `${coeficiente} ${formula}`;
}

/**
 * Balanceia uma equação química de forma determinística usando álgebra linear exata (BigInt Fraction).
 */
function balanceEquation(equacao) {
    if (typeof equacao !== 'string' || !equacao.trim()) {
        throw new ValidationError('Parâmetro equacao é obrigatório e deve ser uma string não vazia.');
    }

    const equacaoOriginal = equacao.trim();
    const arrowMatches = equacaoOriginal.match(/=>|->|→|=/g);
    if (!arrowMatches || arrowMatches.length !== 1) {
        throw new ValidationError('Equação química deve conter exatamente uma seta separando reagentes e produtos (->, =>, → ou =).');
    }

    const [leftSide, rightSide] = equacaoOriginal.split(/=>|->|→|=/);
    const reagentesParsed = parseEquationSide(leftSide);
    const produtosParsed = parseEquationSide(rightSide);

    // Garante que cada lado não repita a mesma espécie (evita ambiguidades triviais)
    const checkDuplicates = (list, sideLabel) => {
        const seen = new Set();
        for (const item of list) {
            if (seen.has(item.formula)) {
                throw new ValidationError(`Espécie duplicada "${item.formula}" no lado dos ${sideLabel}.`);
            }
            seen.add(item.formula);
        }
    };
    checkDuplicates(reagentesParsed, 'reagentes');
    checkDuplicates(produtosParsed, 'produtos');

    const numReactants = reagentesParsed.length;
    const numProducts = produtosParsed.length;
    const numSpecies = numReactants + numProducts;

    const elements = [];
    const elementSet = new Set();
    for (const species of [...reagentesParsed, ...produtosParsed]) {
        for (const el of Object.keys(species.atoms)) {
            if (!elementSet.has(el)) {
                elementSet.add(el);
                elements.push(el);
            }
        }
    }

    // Matriz de conservação (numElementos x numEspecies): + para reagentes, - para produtos
    const matrix = elements.map((el) => {
        const row = [];
        for (const r of reagentesParsed) {
            row.push(new Fraction(r.atoms[el] || 0));
        }
        for (const p of produtosParsed) {
            row.push(new Fraction(-(p.atoms[el] || 0)));
        }
        return row;
    });

    const { rref, pivotCols } = computeRref(matrix, elements.length, numSpecies);
    const pivotSet = new Set(pivotCols);
    const freeCols = [];
    for (let c = 0; c < numSpecies; c += 1) {
        if (!pivotSet.has(c)) freeCols.push(c);
    }

    if (freeCols.length === 0) {
        throw new ValidationError('Equação quimicamente impossível: apenas a solução trivial nula existe.');
    }
    if (freeCols.length > 1) {
        throw new ValidationError('Equação indeterminada ou ambígua: existem múltiplas reações independentes possíveis.');
    }

    const freeCol = freeCols[0];
    const nullVector = new Array(numSpecies);
    nullVector[freeCol] = new Fraction(1n);
    for (let i = 0; i < pivotCols.length; i += 1) {
        const pCol = pivotCols[i];
        nullVector[pCol] = rref[i][freeCol].neg();
    }

    if (nullVector.some((v) => v.isZero())) {
        throw new ValidationError('Equação quimicamente impossível: uma ou mais espécies teriam coeficiente zero.');
    }

    const firstPositive = nullVector[0].num > 0n;
    const allSameSign = nullVector.every((v) => (v.num > 0n) === firstPositive);
    if (!allSameSign) {
        throw new ValidationError('Equação quimicamente impossível: não há solução com todos os coeficientes positivos.');
    }

    const positiveFractions = firstPositive ? nullVector : nullVector.map((v) => v.neg());

    let denLcm = 1n;
    for (const frac of positiveFractions) {
        denLcm = lcm(denLcm, frac.den);
    }

    const scaledInts = positiveFractions.map((frac) => frac.num * (denLcm / frac.den));
    let numGcd = 0n;
    for (const val of scaledInts) {
        numGcd = gcd(numGcd, val);
    }

    const reducedBigInts = scaledInts.map((val) => val / numGcd);
    const coefNumbers = reducedBigInts.map((val) => {
        if (val <= 0n || val > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new ValidationError('Coeficientes calculados excedem o limite numérico seguro.');
        }
        return Number(val);
    });

    const reagentes = reagentesParsed.map((r, idx) => ({
        formula: r.formula,
        coeficiente: coefNumbers[idx],
        massaMolar: calculateMolarMass(r.formula).massaMolar,
        atoms: r.atoms
    }));

    const produtos = produtosParsed.map((p, idx) => ({
        formula: p.formula,
        coeficiente: coefNumbers[numReactants + idx],
        massaMolar: calculateMolarMass(p.formula).massaMolar,
        atoms: p.atoms
    }));

    // Verificação independente estrita de conservação de massa/átomos
    const conservacao = {};
    for (const el of elements) {
        let totalReagentes = 0;
        let totalProdutos = 0;
        for (const r of reagentes) {
            totalReagentes += r.coeficiente * (r.atoms[el] || 0);
        }
        for (const p of produtos) {
            totalProdutos += p.coeficiente * (p.atoms[el] || 0);
        }
        if (totalReagentes !== totalProdutos || totalReagentes <= 0) {
            throw new Error(`Falha na verificação de conservação do elemento ${el}: reagentes=${totalReagentes}, produtos=${totalProdutos}.`);
        }
        conservacao[el] = {
            reagentes: totalReagentes,
            produtos: totalProdutos,
            conservado: true
        };
    }

    const leftFormatted = reagentes.map((r) => formatSpeciesTerm(r.coeficiente, r.formula)).join(' + ');
    const rightFormatted = produtos.map((p) => formatSpeciesTerm(p.coeficiente, p.formula)).join(' + ');
    const equacaoBalanceada = `${leftFormatted} -> ${rightFormatted}`;

    const coeficientes = {};
    for (const r of reagentes) coeficientes[r.formula] = r.coeficiente;
    for (const p of produtos) coeficientes[p.formula] = p.coeficiente;

    const toPublicSpecies = ({ formula, coeficiente, massaMolar }) => ({ formula, coeficiente, massaMolar });

    return {
        equacaoOriginal,
        equacaoBalanceada,
        reagentes: reagentes.map(toPublicSpecies),
        produtos: produtos.map(toPublicSpecies),
        coeficientes,
        conservacao
    };
}

module.exports = {
    balanceEquation,
    computeRref
};
