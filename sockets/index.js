/**
 * @author zhixin <wenzhixin2010@gmail.com>
 */

var socketList = [];

module.exports = function(sockets) {
	sockets.on('connection', function(socket) {
		var that = {};
		socket.on('join', function(user) {
			that = {
				user: user,
				socket: socket
			}
			socketList.push(that);
			sendUsers();
			sendMessage('系统信息', that.user + ' 加入聊天室！');
		});
		socket.on('message', function(message) {
			sendMessage(that.user, message);
		});
		socket.on('disconnect', function () {
			var index = socketList.indexOf(that);
			if (index !== -1) {
				socketList.splice(index, 1);
				sendUsers();
				sendMessage('系统信息', that.user + ' 离开聊天室！');
			}
		});
	});
};

function sendUsers() {
	var users = [];
	socketList.forEach(function(socket) {
		users.push(socket.user);
	});
	socketList.forEach(function(socket) {
		socket.socket.emit('users', users);
	});
}

function sendMessage(user, info) {
	socketList.forEach(function(socket) {
		socket.socket.emit('message', {
			user: user,
			info: info
		});
	});
}
