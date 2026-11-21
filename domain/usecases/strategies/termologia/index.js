const {
    ValidationError,
    cleanNumber,
    assertFiniteNumber,
    assertNonEmptyString
} = require('../../../../utils/calculationHelpers');

const MAGNUS_A = 17.62;
const MAGNUS_B = 243.12;
const ABSOLUTE_ZERO_C = -273.15;
const MIN_TEMP_MAGNUS_C = -45;
const MAX_TEMP_MAGNUS_C = 60;

function interpretDewPointSpread(diferencaOrvalho) {
    if (diferencaOrvalho <= 2) {
        return 'Ar muito próximo da saturação; alto risco de condensação, formação de orvalho ou neblina.';
    }
    if (diferencaOrvalho <= 6) {
        return 'Umidade relativa moderada a elevada; sensação de ar úmido com aproximação moderada do ponto de orvalho.';
    }
    return 'Ar relativamente seco; baixa probabilidade de condensação nas condições atuais.';
}

module.exports = {
    'ponto-de-orvalho': (params = {}) => {
        const T = assertFiniteNumber(params.temperatura, 'temperatura');
        if (T < ABSOLUTE_ZERO_C) {
            throw new ValidationError(`O parâmetro temperatura (${T} °C) está abaixo do zero absoluto (${ABSOLUTE_ZERO_C} °C).`);
        }
        if (T < MIN_TEMP_MAGNUS_C || T > MAX_TEMP_MAGNUS_C) {
            throw new ValidationError(
                `O parâmetro temperatura (${T} °C) está fora do domínio de validade da equação de Magnus [${MIN_TEMP_MAGNUS_C} °C, ${MAX_TEMP_MAGNUS_C} °C].`
            );
        }

        const UR = assertFiniteNumber(params.umidadeRelativa, 'umidadeRelativa');
        if (UR <= 0 || UR > 100) {
            throw new ValidationError('O parâmetro umidadeRelativa deve estar no intervalo (0, 100] %.');
        }

        let origem = 'manual';
        if (params.origem !== undefined) {
            origem = assertNonEmptyString(params.origem, 'origem');
        }

        const gamma = Math.log(UR / 100) + (MAGNUS_A * T) / (MAGNUS_B + T);
        const denominator = MAGNUS_A - gamma;
        if (Math.abs(denominator) < 1e-12) {
            throw new ValidationError('Parâmetros resultam em singularidade numérica na equação de Magnus.');
        }

        let tdPreciso = (MAGNUS_B * gamma) / denominator;
        if (tdPreciso > T + 1e-9) {
            throw new Error(`Violação de invariante física: ponto de orvalho (${tdPreciso}) maior que temperatura (${T}).`);
        }
        if (tdPreciso > T) {
            tdPreciso = T;
        }

        const pontoOrvalho = cleanNumber(tdPreciso, 2);
        const pontoOrvalhoPreciso = cleanNumber(tdPreciso, 6);
        const diferencaOrvalho = cleanNumber(T - tdPreciso, 2);
        const gammaRounded = cleanNumber(gamma, 6);

        return {
            resultado: `${pontoOrvalho} °C`,
            pontoOrvalho,
            pontoOrvalhoPreciso,
            unidade: '°C',
            temperatura: T,
            umidadeRelativa: UR,
            gamma: gammaRounded,
            diferencaOrvalho,
            constantes: { a: MAGNUS_A, b: MAGNUS_B },
            formula: 'γ = ln(UR/100) + (a·T)/(b+T); Td = (b·γ)/(a−γ)',
            variaveis: { T, UR, a: MAGNUS_A, b: MAGNUS_B },
            substituicao: `γ = ln(${UR}/100) + (${MAGNUS_A}·${T})/(${MAGNUS_B}+${T}) = ${gammaRounded}; Td = (${MAGNUS_B}·${gammaRounded})/(${MAGNUS_A}−${gammaRounded}) = ${pontoOrvalho} °C`,
            passos: [
                `γ = ln(${UR} / 100) + (${MAGNUS_A} × ${T}) / (${MAGNUS_B} + ${T}) = ${gammaRounded}`,
                `Td = (${MAGNUS_B} × ${gammaRounded}) / (${MAGNUS_A} − ${gammaRounded}) = ${pontoOrvalhoPreciso} °C (≈ ${pontoOrvalho} °C)`,
                `Depressão do ponto de orvalho (T − Td) = ${T} − ${pontoOrvalhoPreciso} ≈ ${diferencaOrvalho} °C`
            ],
            interpretacao: interpretDewPointSpread(diferencaOrvalho),
            dominioValido: true,
            origem
        };
    }
};
