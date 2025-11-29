
# Math API (mathApi)

Breve descrição
----------------
API REST para cálculos matemáticos e físicos consumida pelo frontend CEOS. Esta API implementa endpoints para operações como ângulo, área, estatística, dinâmica, energia, cinética, funções, matrizes e mais.

Principais funcionalidades
-------------------------
- Endpoints REST organizados por responsabilidade (veja `routes/`).
- Lógica de negócio em `usecases/` para facilitar testes e manutenção.
- Testes unitários e de integração em `__tests__/`.
- Suporte a containerização e deploy via `Docker` / `render.yaml`.

Colaboradores
-------------
- Leonardo
- Mauricio
- Rhuan
- Vitor

URL pública (opcional)
---------------------
[SWAGGER](https://mathapi.onrender.com)

Tecnologias utilizadas
----------------------
- Node.js
- Express
- JavaScript (ES6+)
- Testes: Jest + Supertest (quando aplicável)
- Docker (Dockerfile incluído)

Estrutura relevante
-------------------
- `controllers/` — controllers Express que recebem requisições.
- `usecases/` — lógica de cálculo/negócio (Clean Architecture).
- `infrastructure/repositories/` — adaptadores para persistência, se necessário.
- `routes/` — definição das rotas e versões da API.
- `__tests__/` — testes unitários e de integração.

Executando localmente
---------------------
1. Instale dependências:

```cmd
cd mathApi
npm install
```

2. Inicie em desenvolvimento (exemplo com nodemon):

```cmd
npx nodemon index.js
```

ou

```cmd
node index.js
```

3. Executar testes:

```cmd
npm test
```

Porta padrão
------------
Por padrão esta API inicia na porta `8081` (ver `index.js`). Altere via variável de ambiente se necessário.

Endpoints principais (exemplos)
-----------------------------
Veja `routes/` para a lista completa; abaixo seguem exemplos de uso para as rotas mais comuns.

1) Ângulo

- POST /angulo/:tipo
  - Exemplos de `:tipo`: `grauspararadianos`, `radianosparagraus`.
  - Body (exemplo):

```json
{ "valor": 180 }
```

Resposta esperada (exemplo):

```json
{ "resultado": 3.141592653589793 }
```

2) Estatística

- POST /estatistica/:tipo
  - Exemplos de `:tipo`: `media`, `mediana`, `desvio`.
  - Body (exemplo):

```json
{ "valores": [1, 2, 3, 4, 5] }
```

Resposta esperada (exemplo):

```json
{ "resultado": 3 }
```

3) Funções / Equações

- POST /funcao/:tipo
  - Exemplos de `:tipo`: `linear`, `quadratica`.
  - Body (exemplo função linear):

```json
{ "a": 2, "b": 3, "x": 4 }
```

Resposta esperada (exemplo):

```json
{ "resultado": 11 }
```

4) Outras rotas

- Área / Volume / Perímetro: `POST /area/:forma`, `POST /volume/:forma`, `POST /perimetro/:forma` (veja `routes/` para formatos aceitos).
- Matrizes: `POST /matriz/soma`, `POST /matriz/multiplica` (exemplos em `postman/`).

Coleções e testes automatizados
--------------------------------
- Postman collection: `postman/math.postman_collection.json` (útil para testes manuais e CI via Newman).
- Scripts de performance: `tests/perf/k6_test.js` para testes de carga/smoke.

CI / Deploy
----------
- Workflows GitHub Actions (CI) e scripts de segurança (Snyk) podem estar configurados em `.github/workflows/`.
- `render.yaml` e `Dockerfile` estão incluídos para deploy no Render ou containerização.

Observações finais
------------------
- Atualize `Colaboradores` se houver mudanças na equipe.
- Preencha `URL pública` quando a API estiver publicada externamente.
- Para documentação automática, verifique se existe um Swagger/OpenAPI em `swagger/`.

    
