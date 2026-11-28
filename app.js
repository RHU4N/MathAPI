const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { setupSwagger } = require('./swagger/swaggerDocs');

// Domain usecases
const CalculateAnguloUseCase = require('./domain/usecases/CalculateAnguloUseCase');
const CalculateFuncaoUseCase = require('./domain/usecases/CalculateFuncaoUseCase');

// Repositories
const AnguloRepository = require('./infrastructure/repositories/AnguloRepository');
const FuncaoRepository = require('./infrastructure/repositories/FuncaoRepository');

// Route factories
const anguloRoutesFactory = require('./routes/anguloRoutes');
const funcaoRoutesFactory = require('./routes/funcaoRoutes');

// Other route modules (legacy style) - keep for now
const areaRoutes = require('./routes/areaRoutes');
const matrizRoutes = require('./routes/matrizRoutes');
const volumeRoutes = require('./routes/volumeRoutes');
const perimetroRoutes = require('./routes/perimetroRoutes');
const analiseCombRoutes = require('./routes/analiseCombRoutes');
const estatisticaRoutes = require('./routes/estatisticaRoutes');
const cineticaRoutes = require('./routes/cineticaRoutes');
const dinamicaRoutes = require('./routes/dinamicaRoutes');
const energiaRoutes = require('./routes/energiaRoutes');
const solucoesRoutes = require('./routes/solucoesRoutes');
const estequiometriaRoutes = require('./routes/estequiometriaRoutes');
const termoquimicaRoutes = require('./routes/termoquimicaRoutes');
const termologiaRoutes = require('./routes/termologiaRoutes');
const financeiroRoutes = require('./routes/financeiroRoutes');
const successResponse = require('./utils/successResponse');
const { errorResponse, errorHandler, standardizeErrors } = require('./utils/errorResponse');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(standardizeErrors);
  app.use(bodyParser.json());

  // Health
  app.get('/', (req, res) => successResponse(res, null, 'API disponível'));

  // Create usecases and repositories (composition root)
  const anguloUseCase = new CalculateAnguloUseCase();
  const anguloRepository = new AnguloRepository();
  const funcaoUseCase = new CalculateFuncaoUseCase();
  const funcaoRepository = new FuncaoRepository();

  // Mount factories with injected dependencies
  app.use('/angulo', anguloRoutesFactory({ useCase: anguloUseCase, repository: anguloRepository }));
  app.use('/funcao', funcaoRoutesFactory({ useCase: funcaoUseCase, repository: funcaoRepository }));

  // Mount legacy routes
  app.use('/area', areaRoutes);
  app.use('/matriz', matrizRoutes);
  app.use('/volume', volumeRoutes);
  app.use('/perimetro', perimetroRoutes);
  app.use('/analise', analiseCombRoutes);
  app.use('/estatistica', estatisticaRoutes);
  // Física / Química routes
  app.use('/cinetica', cineticaRoutes);
  // Some tests call cinetica endpoints without the '/cinetica' prefix — expose them at root too
  app.use('/', cineticaRoutes);
  app.use('/financeiro', financeiroRoutes);
  app.use('/dinamica', dinamicaRoutes);
  app.use('/energia', energiaRoutes);
  app.use('/solucoes', solucoesRoutes);
  app.use('/estequiometria', estequiometriaRoutes);
  app.use('/termoquimica', termoquimicaRoutes);
  app.use('/termologia', termologiaRoutes);

  // Swagger
  setupSwagger(app);

  // Rota inexistente
  app.use((req, res) => errorResponse(res, 404, 'Endpoint não encontrado'));

  // Erro não tratado (JSON inválido, exceções)
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
