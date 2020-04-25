const express = require('express');
const app = express();



const rutaApp = require('./mainRoute');
app.use('/', rutaApp);

const usuarioApp = require('./usuario');
app.use('/usuario', usuarioApp);


const usuariologin = require('./login');
app.use('/login', usuariologin);


module.exports = app;