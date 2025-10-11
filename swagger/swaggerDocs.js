const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swaggerConfig');

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger };
