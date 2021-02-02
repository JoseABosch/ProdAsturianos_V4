/*Archivo que hace de enrutador que responde a las URLs que comienzan por / definido en el archivo
index.js, y los servicios para poder buscar productos por el nombre y añadir comentarios.*/

const express = require('express');

let Producto = require(__dirname + '/../models/producto.js');
let router = express.Router();

/*Redirige a la página principal de la parte pública, que es la vista publico_index.*/
router.get('/', (req, res) => {
    res.render('publico_index');
});

/*Busca todos los productos cuyo nombre de producto contenga lo que se ha escrito, sin diferenciar entre
mayúsculas y minúsculas, y se muestran en la página principal en una lista.*/
router.get('/buscar', (req, res) => {
    if (req.query.buscar.length > 0) {
        Producto.find({ nombre: new RegExp(req.query.buscar, 'i') }).then(resultado => {
            if (resultado.length > 0)
                res.render('publico_index', { productos: resultado });
            else
                res.render('publico_index', { error: "No se encontraron productos" });
        }).catch(error => {
            res.render('publico_error');
        });
    }
    else
        res.redirect('/');
});

/*Redirige a la página específica del producto para mostrar todos sus datos así como sus comentarios.*/
router.get('/producto/:id', (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('publico_producto', { producto: resultado });
        else
            res.render('publico_error', { error: "Producto no encontrado" });
    }).catch(error => {
        res.render('publico_error');
    });
});

/*Simplemente para añadir un comentario a un producto en cuestión.*/
router.post('/comentarios/:idProducto', (req, res) => {
    Producto.findById(req.params.idProducto).then(product => {
        product.comentarios.push({ nombreUsuario: req.body.nombreUsuario, comentario: req.body.comentario });
        product.save().then(resultado => {
            res.render("publico_producto", { producto: resultado });
        });
    }).catch(error => {
        res.render('publico_error');
    });
});

module.exports = router;