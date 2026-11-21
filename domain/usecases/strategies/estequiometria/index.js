const { calculateMolarMass, parseFormula } = require('./formulaParser');
const { balanceEquation } = require('./balancer');
const {
    ValidationError,
    cleanNumber,
    assertPositiveNumber,
    assertNonNegativeNumber,
    assertNonEmptyString
} = require('../../../../utils/calculationHelpers');

const TIE_TOLERANCE = 1e-9;

function getEquationInput(params = {}) {
    const raw = params.equacao !== undefined ? params.equacao : params.equation;
    return assertNonEmptyString(raw, 'equacao');
}

function findSpecies(list, formulaInput, roleLabel) {
    const target = assertNonEmptyString(formulaInput, roleLabel);
    const found = list.find((item) => item.formula === target);
    if (!found) {
        throw new ValidationError(`Espécie "${target}" não encontrada entre os ${roleLabel} da equação.`);
    }
    return found;
}

function resolveAvailableMols(entry, massaMolar) {
    if (!entry || typeof entry !== 'object') {
        throw new ValidationError('Cada reagente informado deve ser um objeto com formula e massa ou mols.');
    }
    const hasMols = entry.mols !== undefined;
    const hasMassa = entry.massa !== undefined;

    if (!hasMols && !hasMassa) {
        throw new ValidationError(`O reagente "${entry.formula}" deve informar massa (g) ou mols (mol).`);
    }
    if (hasMols) {
        assertNonNegativeNumber(entry.mols, `mols de ${entry.formula}`);
    }
    if (hasMassa) {
        assertNonNegativeNumber(entry.massa, `massa de ${entry.formula}`);
    }

    const molsDisponiveisRaw = hasMols ? entry.mols : entry.massa / massaMolar;
    const massaDisponivelRaw = hasMassa ? entry.massa : entry.mols * massaMolar;

    return { molsDisponiveisRaw, massaDisponivelRaw };
}

module.exports = {
    'balanceamento': (params = {}) => {
        const equacao = getEquationInput(params);
        const balanced = balanceEquation(equacao);
        const elementos = Object.keys(balanced.conservacao);

        return {
            resultado: balanced.equacaoBalanceada,
            equacaoOriginal: balanced.equacaoOriginal,
            equacaoBalanceada: balanced.equacaoBalanceada,
            reagentes: balanced.reagentes,
            produtos: balanced.produtos,
            coeficientes: balanced.coeficientes,
            conservacao: balanced.conservacao,
            formula: 'Conservação de átomos: Σ(coef × átomos_reagentes) = Σ(coef × átomos_produtos)',
            passos: [
                `Equação original: ${balanced.equacaoOriginal}`,
                `Elementos conservados: ${elementos.join(', ')}`,
                'Sistema linear homogêneo resolvido exatamente via Gauss-Jordan com frações BigInt.',
                `Equação balanceada: ${balanced.equacaoBalanceada}`
            ],
            interpretacao: `Equação balanceada com menores coeficientes inteiros positivos, conservando todos os átomos (${elementos.join(', ')}).`
        };
    },

    'massa-molar': (params = {}) => {
        const formulaQuimica = assertNonEmptyString(params.formula, 'formula');
        const { massaMolar, composicao } = calculateMolarMass(formulaQuimica);
        const valor = cleanNumber(massaMolar, 6);

        const substituicao = composicao
            .map((c) => `${c.quantidade} × ${c.massaAtomica} (${c.elemento})`)
            .join(' + ') + ` = ${valor} g/mol`;

        return {
            resultado: `${valor} g/mol`,
            formulaQuimica,
            valor,
            unidade: 'g/mol',
            composicao,
            formula: 'M = Σ(quantidade_i × massa_atomica_i)',
            substituicao,
            passos: [
                ...composicao.map((c) => `${c.elemento}: ${c.quantidade} × ${c.massaAtomica} = ${c.subtotal} g/mol`),
                `Massa molar total: ${valor} g/mol`
            ],
            interpretacao: `1 mol de ${formulaQuimica} tem massa de ${valor} g/mol.`
        };
    },

    'conversao': (params = {}) => {
        const direcao = assertNonEmptyString(params.direcao, 'direcao');
        if (direcao !== 'gramas-para-mols' && direcao !== 'mols-para-gramas') {
            throw new ValidationError('O parâmetro direcao deve ser "gramas-para-mols" ou "mols-para-gramas".');
        }

        let formulaQuimica;
        if (params.formula !== undefined) {
            formulaQuimica = assertNonEmptyString(params.formula, 'formula');
            parseFormula(formulaQuimica);
        }

        let massaMolar;
        if (params.massaMolar !== undefined) {
            massaMolar = cleanNumber(assertPositiveNumber(params.massaMolar, 'massaMolar'), 6);
        } else if (formulaQuimica !== undefined) {
            massaMolar = calculateMolarMass(formulaQuimica).massaMolar;
        } else {
            throw new ValidationError('Parâmetros obrigatórios faltando: informe formula ou massaMolar.');
        }

        if (direcao === 'gramas-para-mols') {
            const massa = assertNonNegativeNumber(params.massa, 'massa');
            const valor = cleanNumber(massa / massaMolar, 6);
            const unidade = 'mol';
            const formula = 'n = m / M';
            const substituicao = `${massa} / ${massaMolar} = ${valor} mol`;
            return {
                resultado: `${valor} ${unidade}`,
                valor,
                unidade,
                massaMolar,
                direcao,
                formula,
                variaveis: {
                    ...(formulaQuimica ? { formulaQuimica } : {}),
                    massa,
                    massaMolar
                },
                substituicao,
                passos: [
                    `Massa molar utilizada: M = ${massaMolar} g/mol`,
                    `Aplicando n = m / M: n = ${massa} / ${massaMolar} = ${valor} mol`
                ],
                interpretacao: `${massa} g equivalem a ${valor} mol para massa molar de ${massaMolar} g/mol.`
            };
        }

        const mols = assertNonNegativeNumber(params.mols, 'mols');
        const valor = cleanNumber(mols * massaMolar, 6);
        const unidade = 'g';
        const formula = 'm = n × M';
        const substituicao = `${mols} × ${massaMolar} = ${valor} g`;

        return {
            resultado: `${valor} ${unidade}`,
            valor,
            unidade,
            massaMolar,
            direcao,
            formula,
            variaveis: {
                ...(formulaQuimica ? { formulaQuimica } : {}),
                mols,
                massaMolar
            },
            substituicao,
            passos: [
                `Massa molar utilizada: M = ${massaMolar} g/mol`,
                `Aplicando m = n × M: m = ${mols} × ${massaMolar} = ${valor} g`
            ],
            interpretacao: `${mols} mol equivalem a ${valor} g para massa molar de ${massaMolar} g/mol.`
        };
    },

    'proporcao-molar': (params = {}) => {
        const equacao = getEquationInput(params);
        const origemInput = assertNonEmptyString(params.especieOrigem, 'especieOrigem');
        const destinoInput = assertNonEmptyString(params.especieDestino, 'especieDestino');
        const quantidadeMols = assertNonNegativeNumber(params.quantidadeMols, 'quantidadeMols');

        const balanced = balanceEquation(equacao);
        const todasEspecies = [...balanced.reagentes, ...balanced.produtos];

        const origem = todasEspecies.find((s) => s.formula === origemInput);
        if (!origem) {
            throw new ValidationError(`Espécie de origem "${origemInput}" não encontrada na equação balanceada.`);
        }
        const destino = todasEspecies.find((s) => s.formula === destinoInput);
        if (!destino) {
            throw new ValidationError(`Espécie de destino "${destinoInput}" não encontrada na equação balanceada.`);
        }

        const coefOrigem = origem.coeficiente;
        const coefDestino = destino.coeficiente;
        const razaoMolar = cleanNumber(coefDestino / coefOrigem, 6);
        const molsOrigem = cleanNumber(quantidadeMols, 6);
        const molsDestinoRaw = quantidadeMols * (coefDestino / coefOrigem);
        const molsDestino = cleanNumber(molsDestinoRaw, 6);
        const massaOrigemG = cleanNumber(quantidadeMols * origem.massaMolar, 6);
        const massaDestinoG = cleanNumber(molsDestinoRaw * destino.massaMolar, 6);

        return {
            resultado: `${molsDestino} mol de ${destino.formula}`,
            equacaoBalanceada: balanced.equacaoBalanceada,
            especieOrigem: origem.formula,
            especieDestino: destino.formula,
            coefOrigem,
            coefDestino,
            razaoMolar,
            molsOrigem,
            molsDestino,
            massaOrigemG,
            massaDestinoG,
            formula: 'n_destino = n_origem × (coef_destino / coef_origem)',
            variaveis: {
                nOrigem: molsOrigem,
                coefOrigem,
                coefDestino
            },
            substituicao: `${molsOrigem} × (${coefDestino} / ${coefOrigem}) = ${molsDestino} mol`,
            passos: [
                `Equação balanceada: ${balanced.equacaoBalanceada}`,
                `Razão estequiométrica (${destino.formula}/${origem.formula}): ${coefDestino}/${coefOrigem} = ${razaoMolar}`,
                `n(${destino.formula}) = ${molsOrigem} × (${coefDestino}/${coefOrigem}) = ${molsDestino} mol`,
                `Massa correspondente: ${massaOrigemG} g de ${origem.formula} ↔ ${massaDestinoG} g de ${destino.formula}`
            ],
            interpretacao: `Na proporção ${coefOrigem}:${coefDestino}, ${molsOrigem} mol de ${origem.formula} (${massaOrigemG} g) correspondem a ${molsDestino} mol de ${destino.formula} (${massaDestinoG} g).`
        };
    },

    'massa-teorica': (params = {}) => {
        const equacao = getEquationInput(params);
        const balanced = balanceEquation(equacao);

        const reagenteEntry = findSpecies(balanced.reagentes, params.reagente, 'reagentes');
        const produtoEntry = findSpecies(balanced.produtos, params.produto, 'produtos');

        const hasMassa = params.massaReagente !== undefined;
        const hasMols = params.molsReagente !== undefined;
        if (!hasMassa && !hasMols) {
            throw new ValidationError('Parâmetros obrigatórios faltando: informe massaReagente ou molsReagente.');
        }
        if (hasMassa) assertNonNegativeNumber(params.massaReagente, 'massaReagente');
        if (hasMols) assertNonNegativeNumber(params.molsReagente, 'molsReagente');

        const molsReagRaw = hasMols
            ? params.molsReagente
            : params.massaReagente / reagenteEntry.massaMolar;
        const molsProdRaw = molsReagRaw * (produtoEntry.coeficiente / reagenteEntry.coeficiente);
        const massaTeoricaRaw = molsProdRaw * produtoEntry.massaMolar;

        const molsReagente = cleanNumber(molsReagRaw, 6);
        const molsProduto = cleanNumber(molsProdRaw, 6);
        const massaTeoricaG = cleanNumber(massaTeoricaRaw, 6);

        return {
            resultado: `${massaTeoricaG} g`,
            equacaoBalanceada: balanced.equacaoBalanceada,
            reagente: reagenteEntry.formula,
            produto: produtoEntry.formula,
            massaMolarReagente: reagenteEntry.massaMolar,
            massaMolarProduto: produtoEntry.massaMolar,
            molsReagente,
            molsProduto,
            massaTeoricaG,
            unidade: 'g',
            formula: 'm_produto = (n_reagente × (coef_produto / coef_reagente)) × M_produto',
            variaveis: {
                molsReagente,
                coefReagente: reagenteEntry.coeficiente,
                coefProduto: produtoEntry.coeficiente,
                massaMolarReagente: reagenteEntry.massaMolar,
                massaMolarProduto: produtoEntry.massaMolar
            },
            substituicao: `(${molsReagente} × (${produtoEntry.coeficiente} / ${reagenteEntry.coeficiente})) × ${produtoEntry.massaMolar} = ${massaTeoricaG} g`,
            passos: [
                `Equação balanceada: ${balanced.equacaoBalanceada}`,
                `Quantidade de ${reagenteEntry.formula}: ${molsReagente} mol (M = ${reagenteEntry.massaMolar} g/mol)`,
                `Mols teóricos de ${produtoEntry.formula}: ${molsReagente} × (${produtoEntry.coeficiente}/${reagenteEntry.coeficiente}) = ${molsProduto} mol`,
                `Massa teórica de ${produtoEntry.formula}: ${molsProduto} × ${produtoEntry.massaMolar} = ${massaTeoricaG} g`
            ],
            interpretacao: `A reação completa de ${molsReagente} mol de ${reagenteEntry.formula} produz teoricamente ${massaTeoricaG} g (${molsProduto} mol) de ${produtoEntry.formula}.`
        };
    },

    'reagente-limitante': (params = {}) => {
        const equacao = getEquationInput(params);
        if (!Array.isArray(params.reagentes) || params.reagentes.length === 0) {
            throw new ValidationError('O parâmetro reagentes é obrigatório e deve ser um array não vazio.');
        }

        const balanced = balanceEquation(equacao);
        const eqReactantMap = new Map(balanced.reagentes.map((r) => [r.formula, r]));
        const providedMap = new Map();

        for (const item of params.reagentes) {
            if (!item || typeof item !== 'object') {
                throw new ValidationError('Cada item de reagentes deve ser um objeto válido.');
            }
            const formula = assertNonEmptyString(item.formula, 'reagentes[].formula');
            if (!eqReactantMap.has(formula)) {
                throw new ValidationError(`Reagente desconhecido ou ausente nos reagentes da equação: "${formula}".`);
            }
            if (providedMap.has(formula)) {
                throw new ValidationError(`Reagente duplicado na entrada: "${formula}".`);
            }
            const eqInfo = eqReactantMap.get(formula);
            const { molsDisponiveisRaw, massaDisponivelRaw } = resolveAvailableMols(item, eqInfo.massaMolar);
            providedMap.set(formula, {
                formula,
                coeficiente: eqInfo.coeficiente,
                massaMolar: eqInfo.massaMolar,
                molsDisponiveisRaw,
                massaDisponivelRaw,
                razaoEstequiometricaRaw: molsDisponiveisRaw / eqInfo.coeficiente
            });
        }

        const missingReactants = balanced.reagentes
            .filter((r) => !providedMap.has(r.formula))
            .map((r) => r.formula);
        if (missingReactants.length > 0) {
            throw new ValidationError(`Parâmetros faltando para os seguintes reagentes da equação: ${missingReactants.join(', ')}.`);
        }

        if (params.produtoAlvo !== undefined) {
            findSpecies(balanced.produtos, params.produtoAlvo, 'produtos');
        }

        const entries = balanced.reagentes.map((r) => providedMap.get(r.formula));
        const minRazao = Math.min(...entries.map((e) => e.razaoEstequiometricaRaw));
        const tol = TIE_TOLERANCE * Math.max(1, minRazao);

        const limitantes = entries.filter((e) => Math.abs(e.razaoEstequiometricaRaw - minRazao) <= tol);
        const empateEstequiometrico = limitantes.length > 1;

        const analiseReagentes = entries.map((e) => {
            const limitante = Math.abs(e.razaoEstequiometricaRaw - minRazao) <= tol;
            const molsConsumidosRaw = minRazao * e.coeficiente;
            const molsExcessoRaw = limitante ? 0 : Math.max(0, e.molsDisponiveisRaw - molsConsumidosRaw);

            return {
                formula: e.formula,
                coeficiente: e.coeficiente,
                massaMolar: e.massaMolar,
                molsDisponiveis: cleanNumber(e.molsDisponiveisRaw, 6),
                massaDisponivelG: cleanNumber(e.massaDisponivelRaw, 6),
                razaoEstequiometrica: cleanNumber(e.razaoEstequiometricaRaw, 6),
                limitante,
                molsConsumidos: cleanNumber(molsConsumidosRaw, 6),
                massaConsumidaG: cleanNumber(molsConsumidosRaw * e.massaMolar, 6),
                molsExcesso: cleanNumber(molsExcessoRaw, 6),
                massaExcessoG: cleanNumber(molsExcessoRaw * e.massaMolar, 6)
            };
        });

        const reagentesEmExcesso = analiseReagentes.filter((r) => !r.limitante);

        const produtosGerados = balanced.produtos.map((p) => {
            const molsGeradosRaw = minRazao * p.coeficiente;
            return {
                formula: p.formula,
                coeficiente: p.coeficiente,
                massaMolar: p.massaMolar,
                molsGerados: cleanNumber(molsGeradosRaw, 6),
                massaGeradaG: cleanNumber(molsGeradosRaw * p.massaMolar, 6)
            };
        });

        const produtoAlvoInfo = params.produtoAlvo !== undefined
            ? produtosGerados.find((p) => p.formula === params.produtoAlvo.trim())
            : produtosGerados[0];

        const limitanteNames = limitantes.map((l) => l.formula);
        const reagenteLimitante = empateEstequiometrico ? null : limitanteNames[0];

        const resumoProduto = produtoAlvoInfo
            ? `produzindo ${produtoAlvoInfo.massaGeradaG} g (${produtoAlvoInfo.molsGerados} mol) de ${produtoAlvoInfo.formula}`
            : '';

        const resultado = empateEstequiometrico
            ? `Empate estequiométrico (${limitanteNames.join(' e ')}): todos os reagentes são consumidos integralmente${resumoProduto ? ', ' + resumoProduto : ''}.`
            : `Reagente limitante: ${reagenteLimitante}${resumoProduto ? ' (' + resumoProduto + ')' : ''}`;

        return {
            resultado,
            equacaoBalanceada: balanced.equacaoBalanceada,
            empateEstequiometrico,
            reagenteLimitante,
            reagentesLimitantes: limitanteNames,
            extensaoReacaoMols: cleanNumber(minRazao, 6),
            analiseReagentes,
            reagentesEmExcesso,
            produtosGerados,
            ...(params.produtoAlvo !== undefined ? { produtoAlvo: produtoAlvoInfo } : {}),
            formula: 'ξ = min(n_reagente_i / coef_i); n_consumido = ξ × coef_i; n_excesso = n_disponível − n_consumido',
            passos: [
                `Equação balanceada: ${balanced.equacaoBalanceada}`,
                ...analiseReagentes.map((r) => `${r.formula}: ${r.molsDisponiveis} mol / ${r.coeficiente} = ${r.razaoEstequiometrica} (${r.limitante ? 'limitante' : `excesso de ${r.molsExcesso} mol / ${r.massaExcessoG} g`})`),
                ...produtosGerados.map((p) => `Produto ${p.formula}: ${p.molsGerados} mol (${p.massaGeradaG} g)`)
            ],
            interpretacao: resultado
        };
    }
};
