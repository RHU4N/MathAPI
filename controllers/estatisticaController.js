//***ESTATISTICA***

// Média
function media(...numeros) {
    try {
        if (numeros.length === 0) {
            throw new Error("É necessário fornecer pelo menos um número.");
        }

        if (!numeros.every(num => typeof num === "number" && !isNaN(num))) {
            throw new Error("Todos os valores devem ser números válidos.")
        }

        return parseFloat(Math.mean(numeros).toFixed(2));
    }
    catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}

// Mediana
function mediana(...numeros) {
    try {
        if (numeros.length === 0) {
            throw new Error("É necessário fornecer pelo menos um número.");
        }

        if (!numeros.every(num => typeof num === "number" && !isNaN(num))) {
            throw new Error("Todos os valores devem ser números válidos.")
        }

        let pos = numeros.length / 2;
        let m;
        if (numeros.length % 2 == 0) {
            m = media(numeros[pos], numeros[pos - 1]);
        } else {
            m = numeros[Math.floor(pos)];
        }
        return m;
    }
    catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}

// Moda
function moda(...numeros) {
    try {

        if (numeros.length === 0) {
            throw new Error("É necessário fornecer pelo menos um número.");
        }

        if (!numeros.every(num => typeof num === "number" && !isNaN(num))) {
            throw new Error("Todos os valores devem ser números válidos.")
        }

        return Math.mode(numeros);
    }
    catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}