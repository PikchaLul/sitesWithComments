const express = require('express');
const config = require('./config');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');

const routes = require('./routes');

mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection.on('errors', error => console.log(error));
mongoose.connection.on('close', () => console.log('Data base connection closed'));
mongoose.connection.on('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
});
mongoose.connect(config.MONGO_URL, {useNewUrlParser: true});

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(
    '/datePicker',
    express.static(path.join(__dirname, '/node_modules', '/@chenfengyuan', '/datepicker', '/dist')));
app.use(
    '/js',
    express.static(path.join(__dirname, '/node_modules', '/jquery', '/dist'))
);

app.use('/', routes.archive);
app.use('/comment', routes.comment);
app.use('/sort', routes.sort);
app.use('/search', routes.search);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: !config.IS_PRODUCTION ? error : {}
    });
});

app.listen(config.PORT, () => {
    console.log(`Example app listening on port ${config.PORT}`);
});

