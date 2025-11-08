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
                properties: { error: { type: 'string', example: 'Parâmetros inválidos ou ausentes' } }
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
                properties: { error: { type: 'string', example: 'Token não fornecido' } }
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
                properties: { error: { type: 'string', example: 'Acesso negado' } }
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
                properties: { error: { type: 'string', example: 'Recurso não encontrado' } }
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
                properties: { error: { type: 'string', example: 'Erro interno no servidor' } }
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
      { name: 'Quimica', description: 'Operações de química (planejado)' },
      { name: 'Fisica', description: 'Operações de física (planejado)' },
      { name: 'MatematicaFinanceira', description: 'Operações de matemática financeira (planejado)' },
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
