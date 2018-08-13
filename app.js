var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var convert = require('xml-js');
// npm install --save xml-js

var usersRouter = require('./routes/users');

var app = express();

<<<<<<< Updated upstream

// view engine setup
app.set('views', path.join(__dirname, 'views'));
=======
var fs = require('fs');
var xml = fs.readFileSync('Testsample.xml', 'utf-8');
var inspect = require('util').inspect;
var json = convert.xml2json(xml, {compact : true});

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));
>>>>>>> Stashed changes
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('viewer', {
        layout: false,
        data : json
    });
});

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

<<<<<<< Updated upstream
console.log("예솔쓰~");
console.log("지연쓰~");

console.log("학준쓰~");
console.log("지연쓰~2");
console.log("진짜 지연쓰 ");
console.log("영준쓰~");

module.exports = app;
=======
module.exports = app;
>>>>>>> Stashed changes
