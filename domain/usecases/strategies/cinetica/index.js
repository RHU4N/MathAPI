module.exports = {
    'velocidade': ({ s0, sf, t0, tf } = {}) => {
        const deltaS = sf - s0;
        const deltaT = tf - t0;
        const value = deltaS / deltaT;
        return `Velocidade média = Δs / Δt = ${deltaS} / ${deltaT} = ${value}`;
    },
    'aceleracao': ({ v0, vf, t0, tf } = {}) => {
        const deltaV = vf - v0;
        const deltaT = tf - t0;
        const value = deltaV / deltaT;
        return `Aceleração média = Δv / Δt = ${deltaV} / ${deltaT} = ${value}`;
    },
    'mru': ({ s0, v, t } = {}) => {
        const value = s0 + v * t;
        return `Posição final (MRU) = s0 + v * t = ${s0} + ${v} * ${t} = ${value}`;
    },
    'mruv-posicao': ({ s0, v0, a, t } = {}) => {
        const value = s0 + v0 * t + (a * Math.pow(t, 2)) / 2;
        return `Posição final (MRUV) = s0 + v0 * t + (a * t^2) / 2 = ${s0} + ${v0} * ${t} + (${a} * ${t}^2) / 2 = ${value}`;
    },
    'mruv-velocidade': ({ v0, a, t } = {}) => {
        const value = v0 + a * t;
        return `Velocidade final (MRUV) = v0 + a * t = ${v0} + ${a} * ${t} = ${value}`;
    },
    'torricelli': ({ v0, a, s, s0 } = {}) => {
        const value = Math.sqrt(Math.pow(v0, 2) + 2 * a * (s - s0));
        return `Velocidade final (Torricelli): v^2 = v0^2 + 2 * a * (s - s0) = ${Math.pow(v0, 2)} + 2 * ${a} * (${s} - ${s0}) = ${value} (após raiz quadrada)`;
    },
    'mcu-velocidade-angular': ({ periodo } = {}) => {
        const value = 2 * Math.PI / periodo;
        return `Velocidade angular = 2π / T = 2 * ${Math.PI.toFixed(2)} / ${periodo} = ${value}`;
    },
    'mcu-velocidade-linear': ({ omega, raio } = {}) => {
        const value = omega * raio;
        return `Velocidade linear = ω * r = ${omega} * ${raio} = ${value}`;
    },
    'lancamento-velocidade': ({ v0, angulo, t } = {}) => {
        const vx = v0 * Math.cos(angulo);
        const vy = v0 * Math.sin(angulo) - 9.81 * t;
        return `Velocidade x = v0 * cos(θ) = ${v0} * cos(${angulo}) = ${vx}, Velocidade y = v0 * sin(θ) - g * t = ${v0} * sin(${angulo}) - 9.81 * ${t} = ${vy}`;
    },
    'lancamento-alcance': ({ v0, angulo, g = 9.81 } = {}) => {
        const value = (Math.pow(v0, 2) * Math.sin(2 * angulo)) / g;
        return `Alcance = (v0^2 * sin(2θ)) / g = (${Math.pow(v0, 2)} * sin(2 * ${angulo})) / ${g} = ${value}`;
    },
    'lancamento-altura-maxima': ({ v0, angulo, g = 9.81 } = {}) => {
        const value = (Math.pow(v0, 2) * Math.pow(Math.sin(angulo), 2)) / (2 * g);
        return `Altura máxima = (v0^2 * sin^2(θ)) / (2g) = (${Math.pow(v0, 2)} * sin^2(${angulo})) / (2 * ${g}) = ${value}`;
    },
    'lancamento-tempo-voo': ({ v0, angulo, g = 9.81 } = {}) => {
        const value = (2 * v0 * Math.sin(angulo)) / g;
        return `Tempo de voo = (2 * v0 * sin(θ)) / g = (2 * ${v0} * sin(${angulo})) / ${g} = ${value}`;
    }
};
