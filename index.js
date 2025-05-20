const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8081;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('Estou aqui'));
app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`)); // Corrigido o console.log