/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

$(function() {
	var socket = io.connect(location.origin);
	
	function main() {
		socket.on('users', function(list) {
			var html = [];
			$.each(list, function(i, user) {
				html.push('<li>',
							'<a href="javascript:void(0)" data-id="' + user.id + '">',
								user.username,
							'</a>',
						'</li>');
			});
			$('#users').html(html.join(''));
		});
		socket.on('message', function (data) {
			var $room = $('#room'),
				div = '<div>' + data.user.username + ' : ' + data.info + '</div>';
			if ($room[0].scrollTop + $room.height() >= $room[0].scrollHeight) {
				$room.append(div);
				$room.scrollTop($room[0].scrollHeight - $room.height());
			} else {
				$room.append(div);
			}
	  	});
	  	
	  	$('#startChat').click(startChat);
	  	$('#username').keyup(function(e) {
	  		if (e.keyCode === 13) {
	  			startChat();
	  		}
	  	});
	  	$('#sendMessage').click(sendMessage);
	  	$('#message').keyup(function(e) {
	  		if (e.keyCode === 13) {
	  			sendMessage();
	  		}
	  	});
	}
	
	function startChat() {
  		var $username = $('#username'),
			username = $.trim($username.val());
  		if (username === '') {
  			$username.focus();
  			return;
  		}
  		$('.login').hide();
  		$('.main').show();
  		socket.emit('join', username);
	}
	
	function sendMessage() {
  		var $message = $('#message'),
			message = $.trim($message.val());
  		if (message === '') {
  			$message.focus();
  			return;
  		}
  		$message.val('');
  		socket.emit('message', message);
	}
	
	main();
});
