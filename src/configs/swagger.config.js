const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ant Backend API',
      version: '1.0.0',
      description: 'API documentation for Ant.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local server',
      },
      {
        url: 'http://remote/api/v1',
        description: 'Remote server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Points to your route files with annotations
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJsdoc(options);

const swaggerConfig = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerConfig;
