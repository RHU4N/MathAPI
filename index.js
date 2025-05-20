const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8081;

const matriz = require('./controllers/matrizController');
const area = require('./controllers/areaController.js');
const volume = require('./controllers/volumeController.js') 
const perimetro = require('./controllers/perimetroController.js')
const analise = require('./controllers/analiseCombController');
const angulo = require('./controllers/anguloController');
const estatistica = require('./controllers/estatisticaController');
const funcao = require('./controllers/funcaoController');

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('Estou aqui'));
app.use('/matriz', matriz);
app.use('/area', area);
app.use('/volume', volume);
app.use('/perimetro', perimetro);
app.use('/analise', analise);
app.use('/angulo', angulo);
app.use('/estatistica', estatistica);
app.use('/funcao', funcao);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`)); // Corrigido o console.log