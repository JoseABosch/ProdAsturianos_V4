/*Archivo en el que se definire un middleware de autenticación para verificar si existe un usuario
almacenado en sesión antes de dejar pasar.*/

let autenticacion = (req, res, next) => {
    if (req.session && req.session.login)
        return next();
    else
        res.render('auth_login');
};

module.exports = autenticacion;