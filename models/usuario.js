/*Archivo en el que se va a definir el esquema para la colección de usuarios.*/

const mongoose = require('mongoose');

/*Definición del esquema para los usuarios.*/
let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    }
});

let Usuario = mongoose.model('usuario', usuarioSchema);

module.exports = Usuario;