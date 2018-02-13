const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID;
const request = require('request');

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

    let hospitais = {
        nome: req.body.nome,
        horario: req.body.horario,
        tempo: req.body.tempo,
        imagem: req.body.imagem,
        rua:req.body.rua,
        bairro:req.body.bairro,
        estado:req.body.estado
    }

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${hospitais.rua},+${hospitais.bairro},+${hospitais.estado}&key=AIzaSyCfhWkrDHxzTkxymVOBS-CGGbT5Md1nzeU`;

    request(url, (err, resposta) => {
        let dados = JSON.parse(resposta.body);
        
        hospitais.latitude = dados.results[0].geometry.location.lat;
        hospitais.longitude = dados.results[0].geometry.location.lng;

        req.db.collection('hospital')
        .insert(hospitais, (err, data) => {
            res.send(data);
        });
    });
});



app.get('/direcao', (req, res) => {
    req.db.collection('localizacao')
    .find({})
    .toArray((err, data) => {
        res.send(data);
    });
});


app.post('/direcao', (req, res) => {

    let cliente = {

        rua:req.body.rua,
        bairro:req.body.bairro,
        estado:req.body.estado
    }

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cliente.rua},+${cliente.bairro},+${cliente.estado}&key=AIzaSyCfhWkrDHxzTkxymVOBS-CGGbT5Md1nzeU`;

    request(url, (err, resposta) => {
        let dados = JSON.parse(resposta);
        
        cliente.latitude = dados.results[0].geometry.location.lat;
        cliente.longitude = dados.results[0].geometry.location.lng;

        req.db.collection('localizacao')
        .insert(cliente.latitude, (err, data) => {
            res.send(data);
        });
        req.db.collection('localizacao')
        .insert(cliente.longitude, (err, data) => {
            res.send(data);
        });
    });
});




app.listen(3000, () => {
    console.log('Servidor rodando na 3000'); 
});