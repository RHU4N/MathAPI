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

function createApp() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  // Health
  app.get('/', (req, res) => res.send('Estou aqui'));

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

  // Swagger
  setupSwagger(app);

  // Global error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err && err.stack ? err.stack : err);
    const status = err && err.status ? err.status : 500;
    res.status(status).json({ error: (err && err.message) || 'Internal Server Error' });
  });

  return app;
}

module.exports = { createApp };
