/*Archivo en el que se va a definir el esquema para la colección de productos, así como el esquema local
para los comentarios que tenga un producto.*/

const mongoose = require('mongoose');

/*Definición del esquema local de los comentarios de un producto.*/
let comentarioSchema = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: true,
        trim: true
    },
    comentario: {
        type: String,
        required: true,
        minlength: 5
    }
});

/*Definición del esquema para los productos.*/
let productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 1
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String,
        trim: true
    },
    comentarios: [comentarioSchema]
});

let Producto = mongoose.model('producto', productoSchema);

module.exports = Producto;