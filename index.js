const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

const auth = require(__dirname + '/routes/auth');
const productos = require(__dirname + '/routes/productos');
const publico = require(__dirname + '/routes/publico');

mongoose.connect('mongodb://localhost:27017/ProdAsturianosV3', { useNewUrlParser: true });

let app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'njk');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/admin', productos);
app.use('/auth', auth);
app.use('/', publico);

app.listen(8080);