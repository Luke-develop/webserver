const express = require('express');
const app = express();
const Usuario = require('../../modelos/usuario');
// es una libreria que da soporta para los maps, filter
// En este caso rearmar un objeto.
const _us = require('underscore');
const bcrypt = require('bcrypt');
// se usa la destructuracion y solo traer la funcion que se necesita para analizar el token
const { verificarToken, verificarAdmin } = require('../../middlewares/autenticaciones');

app.get('/', [verificarToken, verificarAdmin], (req, res) => {

    let user = req.usuario;
    Usuario.find({ estado: true }, 'nombre email role estado').exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Problemas para obtener el listado de usuarios registrados',
                Error: err
            });
        }
        Usuario.countDocuments({ estado: true }, (err, conteo) => {
            res.status(200).json({
                ok: true,
                mensaje: 'listado de usuarios registrados',
                usuarios: usuarios,
                total: conteo,
                usuarioToken: user
            });
        });

    });


});

app.post('/', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        // una forma para no mostrar el password
        //usuarioDB.password = ':)';
        res.json({
            ok: true,
            mensaje: 'Usuario creado con exito',
            usuario: usuarioDB
        });
    });
});

app.put('/:id', (req, res) => {

    let id = req.params.id;
    // implementacion underscore
    /* let body = req.body; => la variable body almacena todo los valores traidos del body html*/
    let body = _us.pick(req.body, ['nombre', 'email', 'role', 'estado']);
    /*=> se usa el comando pick del undercore
       para realizar una copia del objeto proveviente del body html y como segunda opcion
       se enumera los elementos que tendra la variable body con sus valor. Nota: recordar que los nombres de los 
       elementos tienen que ser los mismos a los del modelo */
    if (!body.role) {
        body.role = 'USER_ROLE';
    }
    // Usuario.findByIdAndUpdate => investigar esta opcion de upte

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        return res.status(200).json({
            ok: false,
            usuarioDB
        });
    });
    /* Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: 'Usuario no registrado en la base de datos'
            });
        }

        usuarioDB.nombre = body.nombre;
        usuarioDB.email = body.email;
        usuarioDB.role = body.role;

        usuarioDB.save((err, usuarioUpdate) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'usuario actualizado',
                usuarioUpdate
            });

        }); 

    });*/



});



app.delete('/:id', (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, borrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: `Error al borrar el usuario con el ID: ${id}`,
                Error: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Usuario desactivado de la base de datos'
        });
    });
    /*  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 mensaje: `Error al borrar el usuario con el ID: ${id}`,
                 Error: err
             });
         }

         res.status(200).json({
             ok: true,
             mensaje: 'Usuario removido de la base de datos'
         });
     }); */

});

module.exports = app;