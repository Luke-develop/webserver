const jwt = require('jsonwebtoken');

//AUTENTICACION DE TOKEN
let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
        /*  res.json({
             token,
             usuario: decoded.usuario
         }); */
    });
};

// AUTENTICACION DE USUARIO ADMINISTRADOR

let verificarAdmin = (req, res, next) => {

    let role = req.usuario.role;

    if (role != 'ADMIN_ROLE') {

        return res.status(401).json({
            ok: false,
            mensaje: 'usuario no admitido',
            role
        });
    } else {

        next();
    }

};


module.exports = {
    verificarToken,
    verificarAdmin
};