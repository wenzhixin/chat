/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

var express = require('express'),
	http = require('http'),
	sockets = require('./sockets'),

	app = module.exports = express(),
  	server = http.createServer(app),
  	io = require('socket.io').listen(server);

app.configure(function() {
	app.set('port', process.env.PORT || 8888);
	app.use(express.logger('dev'));
	app.use(express.static(__dirname + '/html'));
	app.use(express.favicon());
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		secret: 'secret',
		cookie: {
			path: '/',
			httpOnly: false,
			maxAge: 3600000 * 24 * 7
		}
	}));
	app.use(app.router);
});

sockets(io.sockets);

server.listen(app.get('port'), function() {
	console.log('Server listening on port %d in %s mode', app.get('port'), app.get('env'));
});