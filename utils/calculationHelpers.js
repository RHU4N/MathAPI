const successResponse = require('./successResponse');

/**
 * Erro de validação de domínio/entrada que deve ser mapeado para HTTP 400.
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.status = 400;
    }
}

/**
 * Remove ruídos de ponto flutuante IEEE-754 mantendo até `decimals` casas decimais.
 */
function cleanNumber(value, decimals = 6) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return value;
    }
    const rounded = Number(value.toFixed(decimals));
    return Object.is(rounded, -0) ? 0 : rounded;
}

/**
 * Valida que um campo é um número finito.
 */
function assertFiniteNumber(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new ValidationError(`O parâmetro ${name} deve ser um número finito.`);
    }
    return value;
}

/**
 * Valida que um campo é um número finito estritamente positivo (> 0).
 */
function assertPositiveNumber(value, name) {
    assertFiniteNumber(value, name);
    if (value <= 0) {
        throw new ValidationError(`O parâmetro ${name} deve ser maior que zero.`);
    }
    return value;
}

/**
 * Valida que um campo é um número finito não negativo (>= 0).
 */
function assertNonNegativeNumber(value, name) {
    assertFiniteNumber(value, name);
    if (value < 0) {
        throw new ValidationError(`O parâmetro ${name} deve ser maior ou igual a zero.`);
    }
    return value;
}

/**
 * Valida que um campo é uma string não vazia após trim.
 */
function assertNonEmptyString(value, name) {
    if (typeof value !== 'string' || !value.trim()) {
        throw new ValidationError(`O parâmetro ${name} é obrigatório e deve ser uma string não vazia.`);
    }
    return value.trim();
}

/**
 * Mapeia erros de validação/domínio para respostas HTTP consistentes nos controllers.
 */
function mapErrorToResponse(error) {
    const msg = error && error.message ? String(error.message) : 'Erro interno no servidor';
    const lower = msg.toLowerCase();
    if (
        (error && (error.status === 400 || error.name === 'ValidationError')) ||
        lower.includes('parâmetr') ||
        lower.includes('obrig') ||
        lower.includes('deve')
    ) {
        return { status: 400, msg };
    }
    if ((error && error.status === 404) || (lower.includes('não') && lower.includes('encontr'))) {
        return { status: 404, msg };
    }
    return { status: 500, msg: 'Erro interno no servidor' };
}

/**
 * Cria um handler Express para executar uma ação de caso de uso validando o corpo JSON.
 */
function createActionHandler(usecase) {
    return (action) => async (req, res) => {
        try {
            if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
                throw new ValidationError('Parâmetros do corpo da requisição devem formar um objeto JSON.');
            }
            const result = await usecase.execute(action, req.body);
            return successResponse(res, result);
        } catch (error) {
            const { status, msg } = mapErrorToResponse(error);
            return res.status(status).json({ error: msg });
        }
    };
}

module.exports = {
    ValidationError,
    cleanNumber,
    assertFiniteNumber,
    assertPositiveNumber,
    assertNonNegativeNumber,
    assertNonEmptyString,
    mapErrorToResponse,
    createActionHandler
};
