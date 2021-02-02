/*Archivo que hace de enrutador que responde a las URLs que comienzan por /auth definido en el archivo
index.js, y los servicios para poder redirigir a la vista de iniciar sesión, como la comprobación
de los datos introducidos para poder iniciar sesión si son correctos como para salir de la sesión.*/

const express = require('express');
const sha256 = require('crypto-js/sha256');
const session = require('express-session');

let router = express.Router();
let Usuario = require(__dirname + '/../models/usuario.js');

/*Este middleware se emplea para poder acceder a la sesión desde las vistas como una variable "session". 
Es útil para poder mostrar unos contenidos u otros en función de los atributos guardados en la sesión. 
La utilizaremos para mostrar el botón de Login o el de Logout en la vista "admin_base.njk"  según si el 
usuario está validado o no.*/
router.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

/* Configuración de la sesión en la aplicación.*/
router.use(
    session({
        secret: "1234",
        resave: true,
        saveUninitialized: false,
    })
);

/*Redirige a la vista auth_login para poder iniciar sesión.*/
router.get('/login', (req, res) => {
    res.render('auth_login');
});

/*Busca que exista el usuario y que la contraseña, mediante cifrado, sea la correcta, que en caso
afirmativo añade dichos datos a la sesión para hacer login y redirigir a la página principal de la
parte de administración, sino se mostrará el mensaje de error especificado.*/
router.post('/login', (req, res) => {
    Usuario.find({ login: req.body.login, password: sha256(req.body.password).toString() }).then(resultado => {
        if (resultado.length > 0) {
            req.session.login = resultado;
            res.redirect('/admin');
        } else {
            res.render('auth_login', { error: "Usuario incorrecto" });
        }
    }).catch(error => {
        res.render('admin_error');
    });
});

/*Se destruye la sesión para salir de la misma y redirigir a la vista principal de la parte pública.*/
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;