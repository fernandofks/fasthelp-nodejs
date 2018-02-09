const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(expressMongoDb('mongodb://localhost/hospitais'));
app.use(bodyParser.json());
app.use(cors());

app.get('/hospital', (req, res) => {
    req.db.collection('hospital')
    .find({})
    .toArray((err, data) => {
        res.send(data);
    });
});


app.post('/hospital', (req, res) => {
    console.log(req.body);

    let cliente = {
        nome: req.body.nome,
        horario: req.body.horario,
        tempo: req.body.tempo,
        imagem: req.body.imagem
    }

    req.db.collection('hospital')
    .insert(cliente, (err, data) => {
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na 3000'); 
});