const express = require('express');
const path = require('path');
const app = express();

//haciendo publico el index html
app.use(express.static(path.resolve(__dirname, '../../public')));
console.log(path.resolve(__dirname, '../../public'));
app.get('/', (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Ruta inicial raiz'
    });

});

module.exports = app;