let swaggerUi;
let swaggerSpec;
try {
  // optional dependency
  swaggerUi = require('swagger-ui-express');
  ({ swaggerSpec } = require('./swaggerConfig'));
} catch (err) {
  // if swagger packages aren't installed, fallback to noop
  swaggerUi = null;
}

function setupSwagger(app) {
  if (!swaggerUi || !swaggerSpec) return; // noop when missing
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger };
