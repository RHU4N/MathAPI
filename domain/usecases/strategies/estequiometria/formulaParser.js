const { getAtomicMass } = require('./periodicTable');
const { ValidationError, cleanNumber } = require('../../../../utils/calculationHelpers');

const MAX_SUBSCRIPT = 10000;
const MAX_ATOM_COUNT = 1e9;

function mergeAtomCounts(target, source, multiplier = 1) {
    for (const [element, count] of Object.entries(source)) {
        const nextCount = (target[element] || 0) + count * multiplier;
        if (!Number.isSafeInteger(nextCount) || nextCount > MAX_ATOM_COUNT) {
            throw new ValidationError('Contagem atômica excede o limite máximo suportado.');
        }
        target[element] = nextCount;
    }
}

/**
 * Parser recursivo descendente para uma fórmula sem separadores de hidrato.
 */
function parseSegment(segment) {
    let index = 0;
    const len = segment.length;

    function readPositiveInteger(contextLabel) {
        const start = index;
        while (index < len && segment[index] >= '0' && segment[index] <= '9') {
            index += 1;
        }
        if (index === start) return null;
        const raw = segment.slice(start, index);
        if (raw.startsWith('0')) {
            throw new ValidationError(`${contextLabel} inválido (${raw}): deve ser um inteiro positivo sem zero à esquerda.`);
        }
        const value = Number(raw);
        if (!Number.isSafeInteger(value) || value <= 0 || value > MAX_SUBSCRIPT) {
            throw new ValidationError(`${contextLabel} fora do intervalo permitido (1 a ${MAX_SUBSCRIPT}): ${raw}.`);
        }
        return value;
    }

    function parseGroup(expectedClose = null) {
        const counts = Object.create(null);
        let termCount = 0;

        while (index < len) {
            const ch = segment[index];

            if (ch === ')' || ch === ']') {
                if (expectedClose === null) {
                    throw new ValidationError(`Parênteses ou colchetes desbalanceados em "${segment}": fechamento inesperado "${ch}".`);
                }
                if (ch !== expectedClose) {
                    throw new ValidationError(`Delimitadores incompatíveis em "${segment}": esperado "${expectedClose}", encontrado "${ch}".`);
                }
                if (termCount === 0) {
                    throw new ValidationError(`Grupo vazio encontrado em "${segment}".`);
                }
                index += 1;
                return counts;
            }

            if (ch === '(' || ch === '[') {
                const closeChar = ch === '(' ? ')' : ']';
                index += 1;
                const inner = parseGroup(closeChar);
                const multiplier = readPositiveInteger('Subscrito') ?? 1;
                mergeAtomCounts(counts, inner, multiplier);
                termCount += 1;
                continue;
            }

            if (ch >= 'A' && ch <= 'Z') {
                let symbol = ch;
                index += 1;
                if (index < len && segment[index] >= 'a' && segment[index] <= 'z') {
                    symbol += segment[index];
                    index += 1;
                }
                if (getAtomicMass(symbol) === null) {
                    throw new ValidationError(`Elemento químico desconhecido: "${symbol}".`);
                }
                const subscript = readPositiveInteger('Subscrito') ?? 1;
                mergeAtomCounts(counts, { [symbol]: 1 }, subscript);
                termCount += 1;
                continue;
            }

            throw new ValidationError(`Caractere inválido "${ch}" na fórmula "${segment}".`);
        }

        if (expectedClose !== null) {
            throw new ValidationError(`Parênteses ou colchetes desbalanceados em "${segment}": faltando "${expectedClose}".`);
        }
        if (termCount === 0) {
            throw new ValidationError('Fórmula química não pode ser vazia.');
        }
        return counts;
    }

    return parseGroup(null);
}

/**
 * Converte uma fórmula química (suportando grupos aninhados `(...)`, `[...]` e hidratos `.` / `·`)
 * em um mapa `{ Elemento: contagemInteira }`.
 */
function parseFormula(formula) {
    if (typeof formula !== 'string') {
        throw new ValidationError('Parâmetro formula é obrigatório e deve ser uma string.');
    }
    const trimmed = formula.trim();
    if (!trimmed) {
        throw new ValidationError('Parâmetro formula não pode ser uma string vazia.');
    }

    const parts = trimmed.split(/\s*[.·]\s*/);
    const totalCounts = Object.create(null);

    parts.forEach((part, partIdx) => {
        if (!part) {
            throw new ValidationError(`Fórmula inválida "${trimmed}": parte de hidrato vazia.`);
        }
        if (/\s/.test(part)) {
            throw new ValidationError(`Fórmula inválida "${trimmed}": espaços internos não são permitidos.`);
        }

        let multiplier = 1;
        let formulaPart = part;

        if (partIdx > 0 && part[0] >= '0' && part[0] <= '9') {
            const match = part.match(/^(\d+)(.*)$/);
            const rawMult = match[1];
            formulaPart = match[2];
            if (rawMult.startsWith('0')) {
                throw new ValidationError(`Multiplicador de hidrato inválido (${rawMult}) em "${trimmed}".`);
            }
            multiplier = Number(rawMult);
            if (!Number.isSafeInteger(multiplier) || multiplier <= 0 || multiplier > MAX_SUBSCRIPT) {
                throw new ValidationError(`Multiplicador de hidrato fora do intervalo (1 a ${MAX_SUBSCRIPT}) em "${trimmed}".`);
            }
            if (!formulaPart) {
                throw new ValidationError(`Fórmula de hidrato incompleta após multiplicador "${rawMult}" em "${trimmed}".`);
            }
        } else if (partIdx === 0 && part[0] >= '0' && part[0] <= '9') {
            throw new ValidationError(`Fórmula química "${trimmed}" não deve iniciar com dígito.`);
        }

        const partCounts = parseSegment(formulaPart);
        mergeAtomCounts(totalCounts, partCounts, multiplier);
    });

    const result = {};
    for (const key of Object.keys(totalCounts)) {
        result[key] = totalCounts[key];
    }
    return result;
}

/**
 * Calcula a massa molar (g/mol) e a composição elementar detalhada de uma fórmula química.
 */
function calculateMolarMass(formula) {
    const counts = parseFormula(formula);
    const composicao = [];
    let total = 0;

    for (const [elemento, quantidade] of Object.entries(counts)) {
        const massaAtomica = getAtomicMass(elemento);
        const subtotal = cleanNumber(quantidade * massaAtomica, 6);
        total += quantidade * massaAtomica;
        composicao.push({
            elemento,
            quantidade,
            massaAtomica,
            subtotal
        });
    }

    return {
        massaMolar: cleanNumber(total, 6),
        composicao
    };
}

/**
 * Faz parsing de um lado de equação química (termos separados por `+`, com coeficiente líder opcional).
 */
function parseEquationSide(sideStr) {
    if (typeof sideStr !== 'string' || !sideStr.trim()) {
        throw new ValidationError('Cada lado da equação química deve conter ao menos uma substância.');
    }

    const rawTerms = sideStr.split('+');
    return rawTerms.map((rawTerm) => {
        const term = rawTerm.trim();
        if (!term) {
            throw new ValidationError('Equação química inválida: termo vazio próximo ao operador "+".');
        }

        let coeficienteInformado = 1;
        let formula = term;

        if (/^[+-]/.test(term)) {
            throw new ValidationError(`Coeficiente inválido no termo "${term}".`);
        }

        const leadingMatch = term.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
        if (leadingMatch) {
            const rawCoef = leadingMatch[1];
            formula = leadingMatch[2].trim();
            if (rawCoef.includes('.') || rawCoef.includes(',') || rawCoef.startsWith('0')) {
                throw new ValidationError(`Coeficiente líder inválido "${rawCoef}" no termo "${term}": deve ser inteiro positivo.`);
            }
            coeficienteInformado = Number(rawCoef);
            if (!Number.isSafeInteger(coeficienteInformado) || coeficienteInformado <= 0 || coeficienteInformado > MAX_SUBSCRIPT) {
                throw new ValidationError(`Coeficiente líder fora do intervalo permitido (1 a ${MAX_SUBSCRIPT}) no termo "${term}".`);
            }
            if (!formula) {
                throw new ValidationError(`Fórmula ausente após coeficiente "${rawCoef}".`);
            }
        }

        const atoms = parseFormula(formula);
        return {
            formula,
            coeficienteInformado,
            atoms
        };
    });
}

module.exports = {
    parseFormula,
    calculateMolarMass,
    parseEquationSide
};
