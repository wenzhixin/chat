/**
 * @author zhixin <wenzhixin2010@gmail.com>
 */

var uuid = require('node-uuid'),
	socketList = [];

module.exports = function(sockets) {
	sockets.on('connection', function(socket) {
		var that = {};
		socket.on('join', function(user) {
			that = {
				user: {
					id: uuid.v1(),
					username: user,
				},
				socket: socket
			}
			socketList.push(that);
			sendUsers();
			sendMessages({username: '系统信息'}, that.user.username + ' 加入聊天室！');
		});
		socket.on('message', function(data) {
			if (typeof data === 'string') {
				sendMessages(that.user, data);
			} else {
				sendMessage(that.user, data);
			}
		});
		socket.on('disconnect', function () {
			var index = socketList.indexOf(that);
			if (index !== -1) {
				socketList.splice(index, 1);
				sendUsers();
				sendMessages({username: '系统信息'}, that.user.username + ' 离开聊天室！');
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

function sendMessages(user, info) {
	socketList.forEach(function(socket) {
		socket.socket.emit('message', {
			user: user,
			info: info
		});
	});
}

function sendMessage(user, data) {
	socketList.forEach(function(socket) {
		var id = socketList[i].user.id;
		if (id === user.id || id === data.id) {
			socket.socket.emit('message', {
				user: user,
				info: data.info
			});
		}
	});
}
