const CalculateTermologiaUseCase = require('../domain/usecases/CalculateTermologiaUseCase');
const { createActionHandler } = require('../utils/calculationHelpers');

const usecase = new CalculateTermologiaUseCase();
const handle = createActionHandler(usecase);

module.exports = {
    handle,
    pontoDeOrvalho: handle('ponto-de-orvalho')
};
