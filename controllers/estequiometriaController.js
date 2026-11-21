const CalculateEstequiometriaUseCase = require('../domain/usecases/CalculateEstequiometriaUseCase');
const { createActionHandler } = require('../utils/calculationHelpers');

const usecase = new CalculateEstequiometriaUseCase();
const handle = createActionHandler(usecase);

module.exports = {
    handle,
    balanceamento: handle('balanceamento'),
    massaMolar: handle('massa-molar'),
    conversao: handle('conversao'),
    proporcaoMolar: handle('proporcao-molar'),
    massaTeorica: handle('massa-teorica'),
    reagenteLimitante: handle('reagente-limitante')
};
