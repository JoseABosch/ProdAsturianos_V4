/*Archivo que hace de enrutador que responde a las URLs que comienzan por /admin definido en el archivo
index.js, mostrando la lista de productos y los servicios para poder añadir nuevos productos, editarlos 
y borrarlos, así como ver la lista de los comentarios de un producto determinado y poder borrarlos.*/

const express = require('express');
const multer = require('multer');

let Producto = require(__dirname + '/../models/producto.js');
let autenticacion = require(__dirname + '/../utils/auth.js');
let router = express.Router();

/*Middleware para cuando se añade o se edita la imagen de un producto, enviar dicha imagen a la
carpeta que se especifica modificando también el nombre como se indica.*/
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

let upload = multer({ storage: storage });

/*Comprobando la sesión, redirige a la página principal de la parte de administración, obteniendo
todos los productos que tenemos en la base de datos y mostrándolos.*/
router.get('/', autenticacion, (req, res) => {
    Producto.find().then(resultado => {
        res.render('admin_productos', { productos: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});

/*Redirige a la vista para añadir un nuevo producto.*/
router.get('/nuevo', autenticacion, (req, res) => {
    res.render('admin_productos_form');
});

/*si encuentra el producto especificado por su id en la base de datos, nos lleva a la vista
admin_productos_form cargando los datos de dicho producto para editarlo.*/
router.get('/editar/:id', autenticacion, (req, res) => {
    Producto.findById(req.params.id).then(resultado => {
        if (resultado)
            res.render('admin_productos_form', { producto: resultado });
        else {
            res.render('admin_error', { error: 'Producto no encontrado' });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

/*añade un nuevo producto a la base de datos con los valores especificados. Como la imagen no es
obligatoria, en caso de no añadir imagen, se pone una por defecto. Si todo va bien redirige a la 
página principal de administración.*/
router.post('/', autenticacion, upload.single('imagen'), (req, res) => {
    let productoNuevo = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
    });

    if (typeof req.file === 'undefined')
        productoNuevo.imagen = "user.jpg";
    else
        productoNuevo.imagen = req.file.filename;
    productoNuevo.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

/*Modifica los valores de un producto, pero en vez de por put por post, ya que put da problemas
con upload. Si no se cambia la imagen, no se modifica, ya que vendrá con valor undefined. En caso 
contrario, se modifica. Si todo va bien redirige a la página principal de administración.*/
router.post('/:id', autenticacion, upload.single('imagen'), (req, res) => {
    if (typeof req.file !== 'undefined') {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                imagen: req.file.filename
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error');
        });
    }
    else {
        Producto.findByIdAndUpdate(req.params.id, {
            $set: {
                nombre: req.body.nombre,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
            }
        }, { new: true }).then(resultado => {
            res.redirect(req.baseUrl);
        }).catch(error => {
            res.render('admin_error');
        });
    }
});

/*Busca en la base de datos un producto mediante su id, y si lo encuentra lo borra y redirige
a la página principal de administración.*/
router.delete('/:id', autenticacion, (req, res) => {
    Producto.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('admin_error');
    });
});

/*Redirige a la vista admin_listado_comentarios mostrando todos los comentarios que tiene el
producto espeficicado mediante su id.*/
router.get('/comentarios/:idProducto', autenticacion, (req, res) => {
    Producto.findById(req.params.idProducto).then(resultado => {
        res.render('admin_listado_comentarios', { producto: resultado });
    }).catch(error => {
        res.render('admin_error');
    });
});

/*Borra un comentario en concreto de un producto indicado, para lo que se indica tanto el ID del producto
como del comentario.*/
router.delete('/comentarios/:idProducto/:idComentario', (req, res) => {
    Producto.findById(req.params.idProducto).then(product => {
        if (product.comentarios.length > 0) {
            let comentariosOriginal = product.comentarios.length;

            product.comentarios = product.comentarios.filter(comentario => comentario._id != req.params.idComentario);

            if (product.comentarios.length < comentariosOriginal) {
                product.save().then(resultado => {
                    res.render('admin_listado_comentarios', { producto: resultado });
                });
            }
            else {
                res.render('admin_error');
            }
        }
        else {
            res.render('admin_error');
        }

    }).catch(error => {
        res.render('admin_error');
    });
});


module.exports = router;

