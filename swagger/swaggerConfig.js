import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Céos",
      version: "1.0.0",
      description: "Documentação da API com Swagger para o Projeto Céos",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    ,
      responses: {
        BadRequest: {
          description: 'Requisição inválida',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: { code: { type: 'string', example: 'VALIDATION_ERROR' }, message: { type: 'string', example: 'Parâmetros inválidos ou ausentes' }, statusCode: { type: 'integer', example: 400 } }
                  }
                }
              }
            }
          }
        },
        Unauthorized: {
          description: 'Não autorizado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: { code: { type: 'string', example: 'UNAUTHORIZED' }, message: { type: 'string', example: 'Token não fornecido' }, statusCode: { type: 'integer', example: 401 } }
                  }
                }
              }
            }
          }
        },
        Forbidden: {
          description: 'Proibido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: { code: { type: 'string', example: 'FORBIDDEN' }, message: { type: 'string', example: 'Acesso negado' }, statusCode: { type: 'integer', example: 403 } }
                  }
                }
              }
            }
          }
        },
        NotFound: {
          description: 'Não encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: { code: { type: 'string', example: 'NOT_FOUND' }, message: { type: 'string', example: 'Recurso não encontrado' }, statusCode: { type: 'integer', example: 404 } }
                  }
                }
              }
            }
          }
        },
        InternalError: {
          description: 'Erro interno no servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: { code: { type: 'string', example: 'INTERNAL_ERROR' }, message: { type: 'string', example: 'Erro interno no servidor' }, statusCode: { type: 'integer', example: 500 } }
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [ { bearerAuth: [] } ],
    tags: [
      // Main groups
      { name: 'Matematica', description: 'Operações de matemática (grupo principal)' },
      { name: 'Quimica', description: 'Operações de química ' },
      { name: 'Fisica', description: 'Operações de física ' },
      { name: 'Matematica Financeira', description: 'Operações de matemática financeira ' },
      // // Subcategories under Matematica
      // { name: 'Estatistica', description: 'Operações estatísticas' },
      // { name: 'AnaliseCombinatoria', description: 'Análise combinatória (arranjo, combinação, permutação)' },
      // { name: 'Funcao', description: 'Cálculo de funções (linear, quadrática)' },
      // { name: 'Area', description: 'Cálculo de áreas' },
      // { name: 'Angulo', description: 'Conversões e cálculos de ângulos' },
      // { name: 'Matriz', description: 'Operações com matrizes' },
      // { name: 'Perimetro', description: 'Cálculo de perímetros' },
      // { name: 'Volume', description: 'Cálculo de volumes' }
    ]
  },
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
