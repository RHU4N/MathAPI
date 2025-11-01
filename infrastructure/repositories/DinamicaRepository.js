class DinamicaRepository {
    async save(obj) {
        return Promise.resolve(obj);
    }
}

module.exports = DinamicaRepository;
