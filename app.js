var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();


//create db
mongoose.connect('mongodb://localhost/assetshare');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

//register schemas
require('./schemas/user.js')



// Sessions: 
//server side cookies, stored ina a temp mongo db
//use a client side cookie to identify the corresponding client
app.use(session({
  secret: 'somerandomsecret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store:new MongoStore({mongooseConnection: mongoose.connection}),
  resave: true,
  saveUninitialized: false
}));


// view engine set

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));







//routes:
var indexRouter = require('./routes/index');
var authenticationRouter = require('./routes/authentication')
var libraryRouter = require('./routes/library');
var blogRouter = require('./routes/blog');
var profileRouter = require('./routes/profile');

//adding general data to all responses
app.use(function(req,res,next){
  //check if the user is logged in
  if (req.session && req.session.userId && req.session.email) {
    res.locals.authenticated = true;
    res.locals.email = req.session.email;
    res.locals.username = req.session.username;


    next();
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/', authenticationRouter);
app.use('/profile', profileRouter);
app.use('/library', libraryRouter);
app.use('/blog', blogRouter);


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
