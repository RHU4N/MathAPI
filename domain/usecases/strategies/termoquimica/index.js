const {
    ValidationError,
    cleanNumber,
    assertFiniteNumber,
    assertPositiveNumber,
    assertNonNegativeNumber,
    assertNonEmptyString
} = require('../../../../utils/calculationHelpers');

const ABSOLUTE_ZERO_C = -273.15;

function assertValidCelsiusTemp(value, name) {
    assertFiniteNumber(value, name);
    if (value < ABSOLUTE_ZERO_C) {
        throw new ValidationError(`O parâmetro ${name} deve ser maior ou igual ao zero absoluto (${ABSOLUTE_ZERO_C} °C).`);
    }
    return value;
}

function classifyHeatSign(heatValue) {
    if (heatValue > 0) return 'endotermico';
    if (heatValue < 0) return 'exotermico';
    return 'isotermico';
}

function classifyEnthalpySign(deltaH) {
    if (deltaH < 0) return 'exotermico';
    if (deltaH > 0) return 'endotermico';
    return 'atermico';
}

function describeProcess(processo) {
    if (processo === 'endotermico') return 'Processo endotérmico (absorve calor).';
    if (processo === 'exotermico') return 'Processo exotérmico (libera calor).';
    if (processo === 'isotermico') return 'Processo isotérmico (sem troca de calor sensível).';
    return 'Processo atérmico (variação de entalpia nula).';
}

function validateFormationList(list, fieldName) {
    if (!Array.isArray(list) || list.length === 0) {
        throw new ValidationError(`O parâmetro ${fieldName} é obrigatório e deve ser um array não vazio.`);
    }
    return list.map((item, idx) => {
        if (!item || typeof item !== 'object') {
            throw new ValidationError(`Item ${idx + 1} de ${fieldName} deve ser um objeto válido.`);
        }
        const substancia = assertNonEmptyString(item.substancia, `${fieldName}[${idx}].substancia`);
        const coeficiente = assertPositiveNumber(item.coeficiente, `${fieldName}[${idx}].coeficiente`);
        const entalpiaFormacao = assertFiniteNumber(item.entalpiaFormacao, `${fieldName}[${idx}].entalpiaFormacao`);
        return { substancia, coeficiente, entalpiaFormacao };
    });
}

module.exports = {
    'calor-sensivel': (params = {}) => {
        const massa = assertPositiveNumber(params.massa, 'massa');
        const cRaw = params.calorEspecifico !== undefined ? params.calorEspecifico : params.calor_especifico;
        const calorEspecifico = assertPositiveNumber(cRaw, 'calorEspecifico');

        const hasTi = params.temperaturaInicial !== undefined;
        const hasTf = params.temperaturaFinal !== undefined;
        const deltaTRawInput = params.deltaT !== undefined ? params.deltaT : params.delta_t;
        const hasDeltaT = deltaTRawInput !== undefined;

        let deltaTRaw;
        let formula;
        let variaveis;
        let substituicao;

        if (hasTi || hasTf) {
            if (!hasTi || !hasTf) {
                throw new ValidationError('Parâmetros temperaturaInicial e temperaturaFinal devem ser informados em conjunto (ou informe deltaT).');
            }
            const temperaturaInicial = assertValidCelsiusTemp(params.temperaturaInicial, 'temperaturaInicial');
            const temperaturaFinal = assertValidCelsiusTemp(params.temperaturaFinal, 'temperaturaFinal');
            deltaTRaw = temperaturaFinal - temperaturaInicial;
            const qRaw = massa * calorEspecifico * deltaTRaw;
            const valorJ = cleanNumber(qRaw, 6);
            const valorKJ = cleanNumber(qRaw / 1000, 6);
            const deltaT = cleanNumber(deltaTRaw, 6);
            const processo = classifyHeatSign(valorJ);

            formula = 'Q = m · c · (Tf − Ti)';
            variaveis = { massa, calorEspecifico, temperaturaInicial, temperaturaFinal, deltaT };
            substituicao = `${massa} · ${calorEspecifico} · (${temperaturaFinal} − ${temperaturaInicial}) = ${valorJ} J`;

            return {
                resultado: `${valorJ} J (${valorKJ} kJ)`,
                valorJ,
                valorKJ,
                deltaT,
                unidade: 'J',
                unidadeAlternativa: 'kJ',
                processo,
                formula,
                variaveis,
                substituicao,
                passos: [
                    `ΔT = Tf − Ti = ${temperaturaFinal} − ${temperaturaInicial} = ${deltaT} °C`,
                    `Q = ${massa} × ${calorEspecifico} × ${deltaT} = ${valorJ} J`,
                    `Conversão para kJ: ${valorJ} / 1000 = ${valorKJ} kJ`
                ],
                interpretacao: describeProcess(processo)
            };
        }

        if (!hasDeltaT) {
            throw new ValidationError('Parâmetros obrigatórios faltando: informe temperaturaInicial e temperaturaFinal, ou deltaT.');
        }

        deltaTRaw = assertFiniteNumber(deltaTRawInput, 'deltaT');
        const qRaw = massa * calorEspecifico * deltaTRaw;
        const valorJ = cleanNumber(qRaw, 6);
        const valorKJ = cleanNumber(qRaw / 1000, 6);
        const deltaT = cleanNumber(deltaTRaw, 6);
        const processo = classifyHeatSign(valorJ);

        formula = 'Q = m · c · (Tf − Ti)';
        variaveis = { massa, calorEspecifico, deltaT };
        substituicao = `${massa} · ${calorEspecifico} · ${deltaT} = ${valorJ} J`;

        return {
            resultado: `${valorJ} J (${valorKJ} kJ)`,
            valorJ,
            valorKJ,
            deltaT,
            unidade: 'J',
            unidadeAlternativa: 'kJ',
            processo,
            formula,
            variaveis,
            substituicao,
            passos: [
                `Variação de temperatura informada: ΔT = ${deltaT} °C`,
                `Q = ${massa} × ${calorEspecifico} × ${deltaT} = ${valorJ} J`,
                `Conversão para kJ: ${valorJ} / 1000 = ${valorKJ} kJ`
            ],
            interpretacao: describeProcess(processo)
        };
    },

    'variacao-temperatura': (params = {}) => {
        const calorInput = assertFiniteNumber(params.calor, 'calor');
        const massa = assertPositiveNumber(params.massa, 'massa');
        const cRaw = params.calorEspecifico !== undefined ? params.calorEspecifico : params.calor_especifico;
        const calorEspecifico = assertPositiveNumber(cRaw, 'calorEspecifico');

        let unidadeCalor = 'J';
        if (params.unidadeCalor !== undefined) {
            const rawUnit = assertNonEmptyString(params.unidadeCalor, 'unidadeCalor');
            const lowerUnit = rawUnit.toLowerCase();
            if (lowerUnit !== 'j' && lowerUnit !== 'kj') {
                throw new ValidationError('O parâmetro unidadeCalor deve ser "J" ou "kJ".');
            }
            unidadeCalor = lowerUnit === 'kj' ? 'kJ' : 'J';
        }

        const calorJ = unidadeCalor === 'kJ' ? calorInput * 1000 : calorInput;
        const deltaTRaw = calorJ / (massa * calorEspecifico);
        const deltaT = cleanNumber(deltaTRaw, 6);

        let temperaturaFinal = null;
        if (params.temperaturaInicial !== undefined) {
            const temperaturaInicial = assertValidCelsiusTemp(params.temperaturaInicial, 'temperaturaInicial');
            const tfRaw = temperaturaInicial + deltaTRaw;
            if (tfRaw < ABSOLUTE_ZERO_C) {
                throw new ValidationError(`A temperatura final resultante (${cleanNumber(tfRaw, 2)} °C) deve ser maior ou igual ao zero absoluto (${ABSOLUTE_ZERO_C} °C).`);
            }
            temperaturaFinal = cleanNumber(tfRaw, 6);
        }

        const processo = classifyHeatSign(calorJ);
        const resultado = temperaturaFinal !== null
            ? `${deltaT} °C (Tf = ${temperaturaFinal} °C)`
            : `${deltaT} °C`;

        return {
            resultado,
            deltaT,
            temperaturaFinal,
            unidade: '°C',
            processo,
            formula: 'ΔT = Q / (m · c)',
            variaveis: {
                calor: calorInput,
                unidadeCalor,
                calorJ: cleanNumber(calorJ, 6),
                massa,
                calorEspecifico,
                ...(params.temperaturaInicial !== undefined ? { temperaturaInicial: params.temperaturaInicial } : {})
            },
            substituicao: `${cleanNumber(calorJ, 6)} / (${massa} · ${calorEspecifico}) = ${deltaT} °C`,
            passos: [
                ...(unidadeCalor === 'kJ' ? [`Conversão de energia: ${calorInput} kJ = ${cleanNumber(calorJ, 6)} J`] : []),
                `ΔT = ${cleanNumber(calorJ, 6)} / (${massa} × ${calorEspecifico}) = ${deltaT} °C`,
                ...(temperaturaFinal !== null ? [`Tf = ${params.temperaturaInicial} + (${deltaT}) = ${temperaturaFinal} °C`] : [])
            ],
            interpretacao: describeProcess(processo)
        };
    },

    'entalpia-reacao': (params = {}) => {
        const hasProdutos = params.entalpiaProdutos !== undefined;
        const hasReagentes = params.entalpiaReagentes !== undefined;
        const entalpiaMolarRaw = params.entalpiaMolar !== undefined ? params.entalpiaMolar : params.entalpia_molar;
        const molesRaw = params.moles !== undefined ? params.moles : params.mols;
        const hasMolar = entalpiaMolarRaw !== undefined || molesRaw !== undefined;

        if (hasProdutos || hasReagentes) {
            const entalpiaProdutos = assertFiniteNumber(params.entalpiaProdutos, 'entalpiaProdutos');
            const entalpiaReagentes = assertFiniteNumber(params.entalpiaReagentes, 'entalpiaReagentes');
            const deltaH = cleanNumber(entalpiaProdutos - entalpiaReagentes, 6);
            const processo = classifyEnthalpySign(deltaH);

            return {
                resultado: `${deltaH} kJ (${processo})`,
                deltaH,
                unidade: 'kJ',
                processo,
                formula: 'ΔH = H_produtos − H_reagentes',
                variaveis: { entalpiaProdutos, entalpiaReagentes },
                substituicao: `${entalpiaProdutos} − ${entalpiaReagentes} = ${deltaH} kJ`,
                passos: [
                    `Entalpia dos produtos: ${entalpiaProdutos} kJ`,
                    `Entalpia dos reagentes: ${entalpiaReagentes} kJ`,
                    `ΔH = ${entalpiaProdutos} − ${entalpiaReagentes} = ${deltaH} kJ`
                ],
                interpretacao: describeProcess(processo)
            };
        }

        if (hasMolar) {
            const entalpiaMolar = assertFiniteNumber(entalpiaMolarRaw, 'entalpiaMolar');
            const moles = assertNonNegativeNumber(molesRaw, 'moles');
            const deltaH = cleanNumber(entalpiaMolar * moles, 6);
            const processo = classifyEnthalpySign(deltaH);

            return {
                resultado: `${deltaH} kJ (${processo})`,
                deltaH,
                unidade: 'kJ',
                processo,
                formula: 'ΔH = ΔH_molar · n',
                variaveis: { entalpiaMolar, moles },
                substituicao: `${entalpiaMolar} · ${moles} = ${deltaH} kJ`,
                passos: [
                    `Entalpia molar: ${entalpiaMolar} kJ/mol`,
                    `Quantidade de matéria: ${moles} mol`,
                    `ΔH = ${entalpiaMolar} × ${moles} = ${deltaH} kJ`
                ],
                interpretacao: describeProcess(processo)
            };
        }

        throw new ValidationError('Parâmetros obrigatórios faltando: informe entalpiaProdutos e entalpiaReagentes, ou entalpiaMolar e moles.');
    },

    'entalpia-formacao': (params = {}) => {
        const reagentes = validateFormationList(params.reagentes, 'reagentes');
        const produtos = validateFormationList(params.produtos, 'produtos');

        const somaProdutosRaw = produtos.reduce((acc, item) => acc + item.coeficiente * item.entalpiaFormacao, 0);
        const somaReagentesRaw = reagentes.reduce((acc, item) => acc + item.coeficiente * item.entalpiaFormacao, 0);

        const somaProdutos = cleanNumber(somaProdutosRaw, 6);
        const somaReagentes = cleanNumber(somaReagentesRaw, 6);
        const deltaH = cleanNumber(somaProdutosRaw - somaReagentesRaw, 6);
        const processo = classifyEnthalpySign(deltaH);

        const exprProdutos = produtos.map((p) => `${p.coeficiente}·(${p.entalpiaFormacao}) [${p.substancia}]`).join(' + ');
        const exprReagentes = reagentes.map((r) => `${r.coeficiente}·(${r.entalpiaFormacao}) [${r.substancia}]`).join(' + ');

        return {
            resultado: `${deltaH} kJ/mol`,
            deltaH,
            somaProdutos,
            somaReagentes,
            unidade: 'kJ/mol',
            processo,
            formula: 'ΔH = Σ[n · ΔHf(produtos)] − Σ[n · ΔHf(reagentes)]',
            variaveis: { reagentes, produtos },
            substituicao: `(${somaProdutos}) − (${somaReagentes}) = ${deltaH} kJ/mol`,
            passos: [
                `Σ[n · ΔHf(produtos)] = ${exprProdutos} = ${somaProdutos} kJ/mol`,
                `Σ[n · ΔHf(reagentes)] = ${exprReagentes} = ${somaReagentes} kJ/mol`,
                `ΔH = ${somaProdutos} − ${somaReagentes} = ${deltaH} kJ/mol`
            ],
            interpretacao: describeProcess(processo)
        };
    },

    'classificar-processo': (params = {}) => {
        const hasDeltaH = params.deltaH !== undefined;
        const hasCalor = params.calor !== undefined;

        if (!hasDeltaH && !hasCalor) {
            throw new ValidationError('Parâmetros obrigatórios faltando: informe deltaH ou calor.');
        }

        if (hasDeltaH) {
            const valor = cleanNumber(assertFiniteNumber(params.deltaH, 'deltaH'), 6);
            const processo = classifyEnthalpySign(valor);
            const regra = valor < 0 ? 'ΔH < 0 → exotérmico' : valor > 0 ? 'ΔH > 0 → endotérmico' : 'ΔH = 0 → atérmico';
            return {
                resultado: processo,
                tipoValor: 'deltaH',
                valor,
                unidade: 'kJ',
                processo,
                formula: 'Classificação por sinal de ΔH (ΔH < 0: exotérmico; ΔH > 0: endotérmico)',
                variaveis: { deltaH: valor },
                substituicao: `ΔH = ${valor} kJ (${regra})`,
                passos: [
                    `Valor informado: ΔH = ${valor} kJ`,
                    `Critério termodinâmico: ${regra}`
                ],
                interpretacao: describeProcess(processo)
            };
        }

        const valor = cleanNumber(assertFiniteNumber(params.calor, 'calor'), 6);
        const processo = classifyHeatSign(valor);
        const regra = valor > 0 ? 'Q > 0 → endotérmico' : valor < 0 ? 'Q < 0 → exotérmico' : 'Q = 0 → isotérmico';

        return {
            resultado: processo,
            tipoValor: 'calor',
            valor,
            unidade: 'J',
            processo,
            formula: 'Classificação por sinal de Q absorvido (Q > 0: endotérmico; Q < 0: exotérmico)',
            variaveis: { calor: valor },
            substituicao: `Q = ${valor} J (${regra})`,
            passos: [
                `Valor informado: Q = ${valor} J`,
                `Critério calorimétrico: ${regra}`
            ],
            interpretacao: describeProcess(processo)
        };
    }
};
