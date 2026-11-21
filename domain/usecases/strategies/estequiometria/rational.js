function bigIntAbs(value) {
    return value < 0n ? -value : value;
}

/**
 * Máximo divisor comum (BigInt) sempre não negativo.
 */
function gcd(a, b) {
    let x = bigIntAbs(BigInt(a));
    let y = bigIntAbs(BigInt(b));
    while (y !== 0n) {
        const temp = x % y;
        x = y;
        y = temp;
    }
    return x;
}

/**
 * Mínimo múltiplo comum (BigInt) sempre não negativo.
 */
function lcm(a, b) {
    const x = bigIntAbs(BigInt(a));
    const y = bigIntAbs(BigInt(b));
    if (x === 0n || y === 0n) return 0n;
    return (x / gcd(x, y)) * y;
}

function toBigIntValue(input) {
    if (typeof input === 'bigint') return input;
    if (typeof input === 'number') {
        if (!Number.isSafeInteger(input)) {
            throw new Error(`Número não é um inteiro seguro para aritmética exata: ${input}`);
        }
        return BigInt(input);
    }
    if (typeof input === 'string' && /^-?\d+$/.test(input.trim())) {
        return BigInt(input.trim());
    }
    throw new Error(`Valor inválido para fração exata: ${input}`);
}

/**
 * Número racional exato baseado em BigInt, sempre normalizado com denominador > 0 e MDC = 1.
 */
class Fraction {
    constructor(num = 0n, den = 1n) {
        if (num instanceof Fraction && den === 1n) {
            this.num = num.num;
            this.den = num.den;
            return;
        }
        let n = toBigIntValue(num);
        let d = toBigIntValue(den);

        if (d === 0n) {
            throw new Error('Denominador de fração não pode ser zero.');
        }
        if (d < 0n) {
            n = -n;
            d = -d;
        }
        if (n === 0n) {
            this.num = 0n;
            this.den = 1n;
            return;
        }

        const divisor = gcd(n, d);
        this.num = n / divisor;
        this.den = d / divisor;
    }

    static from(value) {
        if (value instanceof Fraction) return value;
        if (typeof value === 'string' && value.includes('/')) {
            const parts = value.split('/');
            if (parts.length !== 2) {
                throw new Error(`Fração inválida: ${value}`);
            }
            return new Fraction(parts[0], parts[1]);
        }
        return new Fraction(value, 1n);
    }

    add(other) {
        const rhs = Fraction.from(other);
        return new Fraction(
            this.num * rhs.den + rhs.num * this.den,
            this.den * rhs.den
        );
    }

    sub(other) {
        const rhs = Fraction.from(other);
        return new Fraction(
            this.num * rhs.den - rhs.num * this.den,
            this.den * rhs.den
        );
    }

    mul(other) {
        const rhs = Fraction.from(other);
        return new Fraction(this.num * rhs.num, this.den * rhs.den);
    }

    div(other) {
        const rhs = Fraction.from(other);
        if (rhs.isZero()) {
            throw new Error('Divisão por zero em aritmética racional.');
        }
        return new Fraction(this.num * rhs.den, this.den * rhs.num);
    }

    neg() {
        return new Fraction(-this.num, this.den);
    }

    abs() {
        return new Fraction(bigIntAbs(this.num), this.den);
    }

    isZero() {
        return this.num === 0n;
    }

    equals(other) {
        const rhs = Fraction.from(other);
        return this.num === rhs.num && this.den === rhs.den;
    }

    toNumber() {
        const quotient = this.num / this.den;
        const remainder = this.num % this.den;
        return Number(quotient) + Number(remainder) / Number(this.den);
    }

    toString() {
        return this.den === 1n ? this.num.toString() : `${this.num}/${this.den}`;
    }
}

module.exports = {
    Fraction,
    gcd,
    lcm
};
