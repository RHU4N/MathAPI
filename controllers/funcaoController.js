function funcao1(a, b, x) {
    try{
        if (typeof a != "number" || isNaN(a)){
            throw new Error("O valor de 'a' (coeficiente linear) deve ser um número.")
        }
        if (typeof b != "number" || isNaN(b)){
            throw new Error("O valor de 'b' (coeficiente angular) deve ser um número.")
        }
        if (typeof x != "number" || isNaN(x)){
            throw new Error("O valor de 'x' deve ser um número.")
        }
        return a * x + b;
    } catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}

function funcao2(a, b, c, x){
    try {
        if (typeof a !== "number" || isNaN(a)) {
            throw new Error("O valor de 'a' (coeficiente de x^2) deve ser um número.");
        }
        if (typeof b !== "number" || isNaN(b)) {
            throw new Error("O valor de 'b' (coeficiente de x) deve ser um número.");
        }
        if (typeof c !== "number" || isNaN(c)) {
            throw new Error("O valor de 'c' (coeficiente constante) deve ser um número.");
        }

        if(x !== undefined){
            if (typeof x !== "number" || isNaN(x)) {
                throw new Error("O valor de 'x' deve ser um número.");
            }
            return a * (x * x) + b * x + c; 
        } 
        else{
            let delta = b * b - 4 * a * c;
            if (delta < 0){
                throw new Error("Não existem raízes reais, delta é negativo.")
            }
            let xNeg = (-b - Math.sqrt(delta)) / (2 * a);
            let xPos = (-b + Math.sqrt(delta)) / (2 * a);
            return [xNeg, xPos];
        }
    } catch (error) {
        console.error("Erro:", error.message);
        return null;
    }
}