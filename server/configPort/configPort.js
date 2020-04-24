// Configuracion del puerto de uso
// si no existe un puerto configurado en el
// process.env.PORT (hosting) 
// se le ingresa un puerto local
process.env.PORT = process.env.PORT || 3000;

//configuracion de conexion a base de datos

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let url;
if (process.env.NODE_ENV === 'dev') {
    url = 'mongodb://localhost:27017/cafe';
} else {
    //Es una variable creada en heroku y por el proceso de envarioment trae esa variable
    //esta variable guarda la cadena de coneccion a mongo atlas DB
    url = process.env.MONGO_CONNECT;
}
process.env.CONNECTION = url;

//configuracion del seed (semilla - secreto - autenticación)

process.env.SEED = process.env.SEED || 'semilla-secreto-desarrollo';

//Configuracion expiracion de token

process.env.TOKEN_EXP = 60 * 60 * 24 * 30;