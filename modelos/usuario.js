const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let roles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE}: rol no válido'
};

let Schema = mongoose.Schema;

let usuario_schema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El mail es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: { type: String, required: false },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    google: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    }

});

// el siguiente codigo es para eliminar el password de los print de pantalla, donde se muestra todos los datos del usuario
//pero no el password
//la palabra "this" hace referencia al modelo usuario_schema y se crea una variable object pasandole el modelo convertido en object
// por ultimo se elimina el password de la variable object y se retorna el resto de los datos.
usuario_schema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

};

mongoose.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Usuario', usuario_schema);