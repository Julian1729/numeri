require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const app = express();

const ApiResponse = require('./helpers/classes/ApiResponse');

// passport config
require('./config/passport.config')(passport);

// connect to database
require('./models/database')(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(e => {
    console.log(`Error connecting to database: ${e.message}`);
  });

app.use(logger('dev'));
// app.use(bodyParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());


// routers
const apiRouter = require('./routes/api.route');

// TODO: configure to serve react files!
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('/', indexRouter);

const attachApiResponseObject = (req, res, next) => {

  res.ApiResponse = () => new ApiResponse(res);
  next();

};

app.use('/api', attachApiResponseObject, apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.log('reached err');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.error.stack);
});

module.exports = app;
