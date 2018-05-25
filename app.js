var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var moment = require('moment');
require('dotenv').config()

var indexRouter = require('./routes/index');
var personsRouter = require('./routes/persons');
var tapesRouter = require('./routes/tapes');

var app = express();

var mongoose = require('mongoose');

// var mongoDB = `mongodb://${process.env.USERNAME}:${process.env.PW}@s229290.mlab.com:29290/nixon-tapes`;
var mongoDB = `mongodb://localhost:27017/accounts`;


mongoose.connect(mongoDB);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/tapes', tapesRouter);
// Person Later
// app.use('/person', personsRouter);

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

module.exports = app;
