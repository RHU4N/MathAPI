/**
 * Tabela periódica completa (Z = 1..118) com massas atômicas padrão IUPAC (g/mol).
 * Consulta case-sensitive exata via Object.prototype.hasOwnProperty.
 */
const ELEMENTS_LIST = [
    { number: 1, symbol: 'H', name: 'Hidrogênio', atomicMass: 1.008 },
    { number: 2, symbol: 'He', name: 'Hélio', atomicMass: 4.0026 },
    { number: 3, symbol: 'Li', name: 'Lítio', atomicMass: 6.94 },
    { number: 4, symbol: 'Be', name: 'Berílio', atomicMass: 9.0122 },
    { number: 5, symbol: 'B', name: 'Boro', atomicMass: 10.81 },
    { number: 6, symbol: 'C', name: 'Carbono', atomicMass: 12.011 },
    { number: 7, symbol: 'N', name: 'Nitrogênio', atomicMass: 14.007 },
    { number: 8, symbol: 'O', name: 'Oxigênio', atomicMass: 15.999 },
    { number: 9, symbol: 'F', name: 'Flúor', atomicMass: 18.998 },
    { number: 10, symbol: 'Ne', name: 'Neônio', atomicMass: 20.180 },
    { number: 11, symbol: 'Na', name: 'Sódio', atomicMass: 22.990 },
    { number: 12, symbol: 'Mg', name: 'Magnésio', atomicMass: 24.305 },
    { number: 13, symbol: 'Al', name: 'Alumínio', atomicMass: 26.982 },
    { number: 14, symbol: 'Si', name: 'Silício', atomicMass: 28.085 },
    { number: 15, symbol: 'P', name: 'Fósforo', atomicMass: 30.974 },
    { number: 16, symbol: 'S', name: 'Enxofre', atomicMass: 32.06 },
    { number: 17, symbol: 'Cl', name: 'Cloro', atomicMass: 35.45 },
    { number: 18, symbol: 'Ar', name: 'Argônio', atomicMass: 39.948 },
    { number: 19, symbol: 'K', name: 'Potássio', atomicMass: 39.098 },
    { number: 20, symbol: 'Ca', name: 'Cálcio', atomicMass: 40.078 },
    { number: 21, symbol: 'Sc', name: 'Escândio', atomicMass: 44.956 },
    { number: 22, symbol: 'Ti', name: 'Titânio', atomicMass: 47.867 },
    { number: 23, symbol: 'V', name: 'Vanádio', atomicMass: 50.942 },
    { number: 24, symbol: 'Cr', name: 'Cromo', atomicMass: 51.996 },
    { number: 25, symbol: 'Mn', name: 'Manganês', atomicMass: 54.938 },
    { number: 26, symbol: 'Fe', name: 'Ferro', atomicMass: 55.845 },
    { number: 27, symbol: 'Co', name: 'Cobalto', atomicMass: 58.933 },
    { number: 28, symbol: 'Ni', name: 'Níquel', atomicMass: 58.693 },
    { number: 29, symbol: 'Cu', name: 'Cobre', atomicMass: 63.546 },
    { number: 30, symbol: 'Zn', name: 'Zinco', atomicMass: 65.38 },
    { number: 31, symbol: 'Ga', name: 'Gálio', atomicMass: 69.723 },
    { number: 32, symbol: 'Ge', name: 'Germânio', atomicMass: 72.630 },
    { number: 33, symbol: 'As', name: 'Arsênio', atomicMass: 74.922 },
    { number: 34, symbol: 'Se', name: 'Selênio', atomicMass: 78.971 },
    { number: 35, symbol: 'Br', name: 'Bromo', atomicMass: 79.904 },
    { number: 36, symbol: 'Kr', name: 'Criptônio', atomicMass: 83.798 },
    { number: 37, symbol: 'Rb', name: 'Rubídio', atomicMass: 85.468 },
    { number: 38, symbol: 'Sr', name: 'Estrôncio', atomicMass: 87.62 },
    { number: 39, symbol: 'Y', name: 'Ítrio', atomicMass: 88.906 },
    { number: 40, symbol: 'Zr', name: 'Zircônio', atomicMass: 91.224 },
    { number: 41, symbol: 'Nb', name: 'Nióbio', atomicMass: 92.906 },
    { number: 42, symbol: 'Mo', name: 'Molibdênio', atomicMass: 95.95 },
    { number: 43, symbol: 'Tc', name: 'Tecnécio', atomicMass: 98 },
    { number: 44, symbol: 'Ru', name: 'Rutênio', atomicMass: 101.07 },
    { number: 45, symbol: 'Rh', name: 'Ródio', atomicMass: 102.91 },
    { number: 46, symbol: 'Pd', name: 'Paládio', atomicMass: 106.42 },
    { number: 47, symbol: 'Ag', name: 'Prata', atomicMass: 107.87 },
    { number: 48, symbol: 'Cd', name: 'Cádmio', atomicMass: 112.41 },
    { number: 49, symbol: 'In', name: 'Índio', atomicMass: 114.82 },
    { number: 50, symbol: 'Sn', name: 'Estanho', atomicMass: 118.71 },
    { number: 51, symbol: 'Sb', name: 'Antimônio', atomicMass: 121.76 },
    { number: 52, symbol: 'Te', name: 'Telúrio', atomicMass: 127.60 },
    { number: 53, symbol: 'I', name: 'Iodo', atomicMass: 126.90 },
    { number: 54, symbol: 'Xe', name: 'Xenônio', atomicMass: 131.29 },
    { number: 55, symbol: 'Cs', name: 'Césio', atomicMass: 132.91 },
    { number: 56, symbol: 'Ba', name: 'Bário', atomicMass: 137.33 },
    { number: 57, symbol: 'La', name: 'Lantânio', atomicMass: 138.91 },
    { number: 58, symbol: 'Ce', name: 'Cério', atomicMass: 140.12 },
    { number: 59, symbol: 'Pr', name: 'Praseodímio', atomicMass: 140.91 },
    { number: 60, symbol: 'Nd', name: 'Neodímio', atomicMass: 144.24 },
    { number: 61, symbol: 'Pm', name: 'Promécio', atomicMass: 145 },
    { number: 62, symbol: 'Sm', name: 'Samário', atomicMass: 150.36 },
    { number: 63, symbol: 'Eu', name: 'Európio', atomicMass: 151.96 },
    { number: 64, symbol: 'Gd', name: 'Gadolínio', atomicMass: 157.25 },
    { number: 65, symbol: 'Tb', name: 'Térbio', atomicMass: 158.93 },
    { number: 66, symbol: 'Dy', name: 'Disprósio', atomicMass: 162.50 },
    { number: 67, symbol: 'Ho', name: 'Hólmio', atomicMass: 164.93 },
    { number: 68, symbol: 'Er', name: 'Érbio', atomicMass: 167.26 },
    { number: 69, symbol: 'Tm', name: 'Túlio', atomicMass: 168.93 },
    { number: 70, symbol: 'Yb', name: 'Itérbio', atomicMass: 173.05 },
    { number: 71, symbol: 'Lu', name: 'Lutécio', atomicMass: 174.97 },
    { number: 72, symbol: 'Hf', name: 'Háfnio', atomicMass: 178.49 },
    { number: 73, symbol: 'Ta', name: 'Tântalo', atomicMass: 180.95 },
    { number: 74, symbol: 'W', name: 'Tungstênio', atomicMass: 183.84 },
    { number: 75, symbol: 'Re', name: 'Rênio', atomicMass: 186.21 },
    { number: 76, symbol: 'Os', name: 'Ósmio', atomicMass: 190.23 },
    { number: 77, symbol: 'Ir', name: 'Irídio', atomicMass: 192.22 },
    { number: 78, symbol: 'Pt', name: 'Platina', atomicMass: 195.08 },
    { number: 79, symbol: 'Au', name: 'Ouro', atomicMass: 196.97 },
    { number: 80, symbol: 'Hg', name: 'Mercúrio', atomicMass: 200.59 },
    { number: 81, symbol: 'Tl', name: 'Tálio', atomicMass: 204.38 },
    { number: 82, symbol: 'Pb', name: 'Chumbo', atomicMass: 207.2 },
    { number: 83, symbol: 'Bi', name: 'Bismuto', atomicMass: 208.98 },
    { number: 84, symbol: 'Po', name: 'Polônio', atomicMass: 209 },
    { number: 85, symbol: 'At', name: 'Astato', atomicMass: 210 },
    { number: 86, symbol: 'Rn', name: 'Radônio', atomicMass: 222 },
    { number: 87, symbol: 'Fr', name: 'Frâncio', atomicMass: 223 },
    { number: 88, symbol: 'Ra', name: 'Rádio', atomicMass: 226 },
    { number: 89, symbol: 'Ac', name: 'Actínio', atomicMass: 227 },
    { number: 90, symbol: 'Th', name: 'Tório', atomicMass: 232.04 },
    { number: 91, symbol: 'Pa', name: 'Protactínio', atomicMass: 231.04 },
    { number: 92, symbol: 'U', name: 'Urânio', atomicMass: 238.03 },
    { number: 93, symbol: 'Np', name: 'Netúnio', atomicMass: 237 },
    { number: 94, symbol: 'Pu', name: 'Plutônio', atomicMass: 244 },
    { number: 95, symbol: 'Am', name: 'Amerício', atomicMass: 243 },
    { number: 96, symbol: 'Cm', name: 'Cúrio', atomicMass: 247 },
    { number: 97, symbol: 'Bk', name: 'Berquélio', atomicMass: 247 },
    { number: 98, symbol: 'Cf', name: 'Califórnio', atomicMass: 251 },
    { number: 99, symbol: 'Es', name: 'Einstênio', atomicMass: 252 },
    { number: 100, symbol: 'Fm', name: 'Férmio', atomicMass: 257 },
    { number: 101, symbol: 'Md', name: 'Mendelévio', atomicMass: 258 },
    { number: 102, symbol: 'No', name: 'Nobélio', atomicMass: 259 },
    { number: 103, symbol: 'Lr', name: 'Laurêncio', atomicMass: 266 },
    { number: 104, symbol: 'Rf', name: 'Rutherfórdio', atomicMass: 267 },
    { number: 105, symbol: 'Db', name: 'Dúbnio', atomicMass: 268 },
    { number: 106, symbol: 'Sg', name: 'Seabórgio', atomicMass: 269 },
    { number: 107, symbol: 'Bh', name: 'Bóhrio', atomicMass: 270 },
    { number: 108, symbol: 'Hs', name: 'Hássio', atomicMass: 277 },
    { number: 109, symbol: 'Mt', name: 'Meitnério', atomicMass: 278 },
    { number: 110, symbol: 'Ds', name: 'Darmstádtio', atomicMass: 281 },
    { number: 111, symbol: 'Rg', name: 'Roentgênio', atomicMass: 282 },
    { number: 112, symbol: 'Cn', name: 'Copernício', atomicMass: 285 },
    { number: 113, symbol: 'Nh', name: 'Nihônio', atomicMass: 286 },
    { number: 114, symbol: 'Fl', name: 'Fleróvio', atomicMass: 289 },
    { number: 115, symbol: 'Mc', name: 'Moscóvio', atomicMass: 290 },
    { number: 116, symbol: 'Lv', name: 'Livermório', atomicMass: 293 },
    { number: 117, symbol: 'Ts', name: 'Tenesso', atomicMass: 294 },
    { number: 118, symbol: 'Og', name: 'Oganessônio', atomicMass: 294 }
];

const ELEMENTS = Object.create(null);
const ATOMIC_MASSES = Object.create(null);

for (const el of ELEMENTS_LIST) {
    ELEMENTS[el.symbol] = Object.freeze({ ...el });
    ATOMIC_MASSES[el.symbol] = el.atomicMass;
}

Object.freeze(ELEMENTS);
Object.freeze(ATOMIC_MASSES);

/**
 * Retorna os dados completos do elemento ou null se não existir (case-sensitive).
 */
function getElement(symbol) {
    if (typeof symbol !== 'string') return null;
    return Object.prototype.hasOwnProperty.call(ELEMENTS, symbol) ? ELEMENTS[symbol] : null;
}

/**
 * Retorna a massa atômica IUPAC do elemento ou null se desconhecido (case-sensitive).
 */
function getAtomicMass(symbol) {
    const el = getElement(symbol);
    return el ? el.atomicMass : null;
}

module.exports = {
    ELEMENTS_LIST,
    ELEMENTS,
    ATOMIC_MASSES,
    getElement,
    getAtomicMass
};
