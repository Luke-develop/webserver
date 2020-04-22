require('./configPort/configPort');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//mongoose - conexion
mongoose.set('useCreateIndex', true);

mongoose.connection.openUri(process.env.CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    else
        console.log('Base de datos online');

});

//usando rutas
const usuarioApp = require('./rutas/usuario');
app.use('/usuario', usuarioApp);

const rutaApp = require('./rutas/mainRoute');
app.use('/', rutaApp);

app.listen(process.env.PORT, () => {
    console.log('escuchando al puerto: ', process.env.PORT);
});