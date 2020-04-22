const express = require('express');
const app = express();

app.get('/', (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Ruta inicial raiz'
    });

});

module.exports = app;