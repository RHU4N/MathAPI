const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8081;

const areaRoutes = require('./routes/areaRoutes');
const matrizRoutes = require('./routes/matrizRoutes');
const volumeRoutes = require('./routes/volumeRoutes');
const perimetroRoutes = require('./routes/perimetroRoutes');
const analiseCombRoutes = require('./routes/analiseCombRoutes');
const anguloRoutes = require('./routes/anguloRoutes');
const estatisticaRoutes = require('./routes/estatisticaRoutes');
const funcaoRoutes = require('./routes/funcaoRoutes');

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('Estou aqui'));
app.use('/area', areaRoutes);
app.use('/matriz', matrizRoutes);
app.use('/volume', volumeRoutes);
app.use('/perimetro', perimetroRoutes);
app.use('/analise', analiseCombRoutes);
app.use('/angulo', anguloRoutes);
app.use('/estatistica', estatisticaRoutes);
app.use('/funcao', funcaoRoutes);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`)); // Corrigido o console.log