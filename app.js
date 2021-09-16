var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    return res.json({
        hello: "hello world"
    })
})

app.get('/hello', (req, res, next) => {
    return res.json({
        hello: "what are you"
    })
})

module.exports = app;
