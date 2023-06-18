var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index')
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var consumidorRouter = require('./routes/consumidor');
var produtorRouter = require('./routes/produtor');
var adminRouter = require('./routes/admin');
var addRecursoRouter = require('./routes/addRecurso');

var app = express();

app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function(req,res) {

  res.redirect("/index");
})

app.use('/index', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/consumidor', consumidorRouter);
app.use('/produtor', produtorRouter);
app.use('/admin', adminRouter);
app.use('/addRecurso', addRecursoRouter);


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
