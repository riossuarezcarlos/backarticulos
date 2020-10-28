'use strict'

// Cargar modulos de nofde para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas 
var article_routes = require('./routes/article');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Añadir prefijos a rutas / Cargar rutas
//// primer valor sobreescribe la url para añadir un "prefijo" -> /api/
app.use('/api', article_routes)

// Ruta o metodo de prueba para APU REST
/*
app.get('/datos-curso', (req, res) => {
    
    return res.status(200).send({
        curso: 'Master en Framework JS',
        autor : 'Carlos Rios Suarez',
        url : 'carlosriossuarez.pe'
    })
});
*/

// Exportar modulo (fichero actual)
module.exports = app;