'use strict';
/* globals bookshelf knex*/
// Database setup
global.knex = require('knex')(require('./knexfile')[process.env.NODE_ENV]);
global.bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var knexLogger = require('knex-logger');
var RedisStore = require('connect-redis')(session);
var config = require('./config');
// var passportSetup = require('./libs/passport-setup');

var app = express();

var apiMiddleware = require('./middleware/bookshelf-api')({
	path: path.join(__dirname, 'models')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	store: new RedisStore(),
	secret: config.session.secret,
	resave: false,
	saveUninitialized: false
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(knexLogger(knex));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// passportSetup(app);

app.use('/api/v1', require('./routes/api1'), apiMiddleware);
// app.use('/user', require('./routes/user'));
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	// res.render('index', { title: 'Express' });
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
