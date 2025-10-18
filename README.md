# MathAPI

API REST para cálculos matemáticos diversos, estruturada em Clean Architecture.

## Desenvolvedores
- Rhuan
- Leonardo
- Vitor
- Mauricio

## Descrição
Esta API permite realizar operações matemáticas como cálculo de área, volume, perímetro, operações com matrizes, análise combinatória, conversão de ângulos, estatística e funções matemáticas.

## Tecnologias
- Node.js
- Express
- Clean Architecture

## Como rodar
1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o servidor:
   ```sh
   npx nodemon index.js
   ```
   O servidor rodará por padrão em `http://localhost:8081`.

## Endpoints principais

### Área
- `POST /area/{forma}`
  - Exemplo: `/area/quadrado`
  - Body:
    ```json
    { "lado": 4, "altura": 4 }
    ```

### Volume
- `POST /volume/{forma}`
  - Exemplo: `/volume/cubo`
  - Body:
    ```json
    { "lado": 3 }
    ```

### Perímetro
- `POST /perimetro/{forma}`
  - Exemplo: `/perimetro/retangulo`
  - Body:
    ```json
    { "largura": 5, "altura": 2 }
    ```

### Matriz
- `POST /matriz/soma`
  - Body:
    ```json
    { "a": [[1,2],[3,4]], "b": [[5,6],[7,8]] }
    ```

### Análise Combinatória
- `POST /analise/{tipo}`
  - Exemplo: `/analise/combinacao`
  - Body:
    ```json
    { "n": 5, "k": 2 }
    ```

### Ângulo
- `POST /angulo/{tipo}`
  - Exemplo: `/angulo/grauspararadianos`
  - Body:
    ```json
    { "valor": 180 }
    ```

### Estatística
- `POST /estatistica/{tipo}`
  - Exemplo: `/estatistica/media`
  - Body:
    ```json
    { "valores": [1,2,3,4,5] }
    ```

### Função
- `POST /funcao/{tipo}`
  - Exemplo: `/funcao/linear`
  - Body:
    ```json
    { "a": 2, "b": 3, "x": 4 }
    ```

## Testando a API
Você pode testar usando [Hoppscotch](https://hoppscotch.io/) ou Postman. Veja exemplos de requisições no início deste README.

---

> Projeto acadêmico para fins de estudo e prática de Clean Architecture.
