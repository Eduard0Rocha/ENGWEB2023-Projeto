var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const session = require('express-session');

var indexRouter = require('./routes/index');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

// connect to DB
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/gfich';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.on('open', function() {
  console.log('MongoDB: conexão estabelecida com sucesso...')
})

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// passport config
var userModel = require('./models/user')
passport.use(new LocalStrategy(userModel.authenticate()))
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

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