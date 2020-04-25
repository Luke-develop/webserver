const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//configuracion de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../../modelos/usuario');


app.post('/', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Contraseña o usuarios incorrectos'
                }
            });
        }
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });
        res.status(200).json({
            ok: true,
            mensaje: 'login correcto',
            usuario: usuarioDB,
            token
        });
    });


});


// SECCION DE MANEJO DE LOGIN DE GOOGLE

let verify = async(token) => {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    /* console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture); */
    return {

        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
};
// verify().catch(console.error);


app.post('/google', async(req, res) => {
    let token_id = req.body.idtoken;

    let google_user = await verify(token_id).catch(console.error);

    Usuario.findOne({ email: google_user.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe logearse con el login comun'
                    }
                });
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });
                return res.status(200).json({
                    usuario: google_user,
                    token: token,
                    mensaje: 'Usuario google logeado correctamente'

                });
            }
        } else {
            let usuario = new Usuario({
                nombre: google_user.nombre,
                email: google_user.email,
                password: ':)',
                img: google_user.img,
                google: true
            });
            usuario.save((err, new_user) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });
                return res.json({
                    ok: true,
                    mensaje: 'Usuario google creado con exito',
                    usuario: new_user,
                    token
                });
            });
        }
    });



});

module.exports = app;