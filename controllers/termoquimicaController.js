const CalculateTermoquimicaUseCase = require('../domain/usecases/CalculateTermoquimicaUseCase');
const { createActionHandler } = require('../utils/calculationHelpers');

const usecase = new CalculateTermoquimicaUseCase();
const handle = createActionHandler(usecase);

module.exports = {
    handle,
    calorSensivel: handle('calor-sensivel'),
    variacaoTemperatura: handle('variacao-temperatura'),
    entalpiaReacao: handle('entalpia-reacao'),
    entalpiaFormacao: handle('entalpia-formacao'),
    classificarProcesso: handle('classificar-processo')
};
