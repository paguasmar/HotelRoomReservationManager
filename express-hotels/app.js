var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors());

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://psi017:psi017@localhost:27017/psi017?retryWrites=true&authSource=psi017';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('/users', usersRouter);

app.listen(app.get('port'), () =>
  console.log(`Example app listening on port 3067!`),
);

module.exports = app;
