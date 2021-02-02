/*Archivo con el que vamos a dejar previamente almacenados que nuestra aplicación no tenga que añadir
nuevos usuarios. Los 2 usuarios que se dan no cumplen ciertas restricciones del modelo de usuario, por
lo que se han quitado esas restricciones para poder añadirlos, que son los usuarios que vienen en el 
enunciado. El tercero ya cumple todas las restricciones, por lo que no hay problemas.
Por último añadir, que se cifran las contraseñas con el sistema de crypto-js mediante sha256.*/

const mongoose = require('mongoose');
const Usuario = require(__dirname + '/../models/usuario');
const sha256 = require('crypto-js/sha256');

mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3');

Usuario.collection.drop();

let usu1 = new Usuario({
    login: 'may',
    password: sha256('1234').toString()
});
usu1.save();

let usu2 = new Usuario({
    login: 'nacho',
    password: sha256('5678').toString()
});
usu2.save();

let usu3 = new Usuario({
    login: 'josebosch',
    password: sha256('jose1234').toString()
});
usu3.save();