const express = require('express');
const http = require('http');
const MongoInterface = require('./lib/MongoInterface');

const app = express();

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
// body parser
app.use(express.json());

app.get('/usuario/:id', (request, response) => {
    console.log('ID:: ' + request.params.id);
    MongoInterface.query('tgi5', 'amigos', { id: request.params.id }, (err, resultado) => {
        response.setHeader('Content-Type', 'application/json');

        if (err) {
            response.status(500).end(JSON.stringify({Error: 'Ha ocurrido un error interno.'}))
            return;
        }

        if (resultado.length < 1) {
            response.status(404).end(JSON.stringify(resultado));
            return;
        }

        response.status(200).end(JSON.stringify(resultado));
    })
})

app.get('/usuario', (request, response) => {

    let query = {}

    // Parametrizacion de la consulta
    if(request.query['firstName']) query.firstName = request.query['firstName']; 
    if(request.query['lastName']) query.lastName = request.query['lastName']; 
    if(request.query['city']) query.city = request.query['city']; 
    if(request.query['streetName']) query.streetName = request.query['streetName']; 
    if(request.query['country']) query.country = request.query['country']; 
    if(request.query['accountName']) query.accountName = request.query['accountName']; 
    if(request.query['account']) query.account = request.query['account']; 
    if(request.query['amount']) query.amount = request.query['amount']; 

    MongoInterface.query('tgi5', 'amigos', query, (err, resultado) => {

        response.setHeader('Content-Type', 'application/json');

        if (err) {
            response.status(500).end(JSON.stringify({Error: 'Ha ocurrido un error interno.'}));
            return;
        }

        if (resultado.length < 1) {
            response.status(404).end(JSON.stringify(resultado));
            return;
        }
        
        response.status(200).end(JSON.stringify(resultado));
    })
});

app.post('/usuario', (request, response) => {
    MongoInterface.insert('tgi5', 'amigos', request.body, (err) => {

        response.setHeader('Content-Type', 'application/json');

        if (err) {
            response.status(500).end(JSON.stringify({Error: 'Ha ocurrido un error interno.'}))
            return;
        }
        
        response.status(201).end(JSON.stringify({ resultado: 'Usuario insertado.' }))
    })
})

app.put('/usuario/:id', (request, response) => {

    response.setHeader('Content-Type', 'application/json');

    // No es posible modificar el id de base de datos.
    if(request.body._id) {
        response.status(400).end(JSON.stringify({Error: 'No es posible modificar un campo especificado.'}));
        return;
    }

    MongoInterface.update('tgi5', 'amigos', request.params.id, request.body, (err, resultado) => {

        if (err) {
            response.status(500).end(JSON.stringify({Error: 'Ha ocurrido un error interno.'}))
            return;
        }
        
        if (resultado.n < 1) {
            response.status(404).end(JSON.stringify({Error: 'El documento solicitado no existe.'}));
            return;
        }

        if (resultado.nModified < 1) {
            response.status(200).end(JSON.stringify({Error: 'No se hicieron modificaciones al documento, puede ser que los valores insertados sean iguales.'}));
            return;
        }
        
        response.status(200).end(JSON.stringify({resultado: 'El usuario fue modificado.'}));
    })
});

app.delete('/usuario/:id', (request, response) => {
    MongoInterface.delete('tgi5', 'amigos', {id: request.params.id}, (err, resultado) => {

        response.setHeader('Content-Type', 'application/json');

        if (err) {
            response.status(500).end(JSON.stringify({Error: 'Ha ocurrido un error interno.'}))
            return;
        }

        if (resultado.n < 1) {
            response.status(404).end(JSON.stringify({Error: 'El documento solicitado no existe.'}));
            return;
        }
        
        response.status(200).end(JSON.stringify({resultado: 'usuario borrado'}));
    })
});

app.listen(3000, function () {
    console.log('Aplicación ejemplo, escuchando el puerto 3000!');
});