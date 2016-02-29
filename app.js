var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';

mongoose.connect(dbUrl);

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
	secret: 'imooc',
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

if ('development' === app.get('env')) {
	app.set('showStackError', true);
	app.use(morgan(':method :url :status'));
	app.locals.pretty = true; //使网页的源代码不是被压缩过的，而是格式化过的，可读性更好
	mongoose.set('debug', true);
}

require('./config/routes')(app);

app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started on port ' + port);