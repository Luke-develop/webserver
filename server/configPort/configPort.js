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
    url = 'mongodb+srv://luke-dev:AWuYyJNQMrRA77D1@dev-nddzw.mongodb.net/cafe';
}

process.env.CONNECTION = url;