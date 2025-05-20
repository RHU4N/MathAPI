//***ANALISE COMBINATÓRIA

// Permutação
function permutacao(n, k) {
    try {
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n < 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro não negativo.");
        }

        if (k !== undefined) {
            if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
                throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
            }
            if (k > n) {
                throw new Error("O valor de 'k' não pode ser maior que 'n'.");
            }

            return Math.permutations(n, k);
        } else {
            return Math.permutations(n);
        }
    }
    catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}

// Combinação
function combinacao(n, k) {
    try {
        // Verifica se 'n' e 'k' são números inteiros não negativos
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n < 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro não negativo.");
        }
        if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
            throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
        }
        if (k > n) {
            throw new Error("O valor de 'k' não pode ser maior que 'n'.");
        }

        return Math.combinations(n, k); // Chamada correta da função em math.js
    } catch (error) {
        console.error("Erro:", error.message);
        return null; // Retorna null em caso de erro
    }
}

// Arranjo
function arranjo(n, k) {
    try {
        // Verifica se 'n' e 'k' são números inteiros não negativos
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n < 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro não negativo.");
        }
        if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
            throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
        }
        if (k > n) {
            throw new Error("O valor de 'k' não pode ser maior que 'n'.");
        }

        // Calcula o arranjo usando Math.js
        return Math.factorial(n) / Math.factorial(n - k);
    } catch (error) {
        console.error("Erro:", error.message);
        return null; // Retorna null em caso de erro
    }
}

// Arranjo com repetição
function arranjoRep(n, k) {
    try {
        // Verifica se 'n' e 'k' são números inteiros não negativos
        if (typeof n !== "number" || isNaN(n) || !Number.isInteger(n) || n <= 0) {
            throw new Error("O valor de 'n' deve ser um número inteiro positivo.");
        }
        if (typeof k !== "number" || isNaN(k) || !Number.isInteger(k) || k < 0) {
            throw new Error("O valor de 'k' deve ser um número inteiro não negativo.");
        }

        return Math.pow(n, k); // Calcula o arranjo com repetição
    } catch (error) {
        console.error("Erro:", error.message);
        return null; // Retorna null em caso de erro
    }
}