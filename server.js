//var http = require("http");
//
//
//	server = http.createServer(function(req, res) {
//		res.writeHead(200,{"Context-Type":"text/html"});
//		res.write('<h1>Master</h1>');
//		res.end();
//	});
//server.listen(80);
//console.log("server started");

var express = require("express");
	app = express();
	server = require('http').createServer(app);
	io = require('socket.io').listen(server);
	users = [];
app.use('/', express.static(__dirname + '/www'));
server.listen(80);

io.on('connection',function(socket){
//	socket.on('foo',function(data){
//		console.log(data);
//	});
	
	socket.on('login',function(nickname){
		if(users.indexOf(nickname) > -1){
			console.log('tip nickname exited: ' + nickname);
			socket.emit('nickExited');
		}else{
			console.log('get nickname success: ' + nickname);
			socket.userIndex = users.length;
			socket.nickname = nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			io.sockets.emit('system',nickname,users.length,'login');
		}
		
	});

	socket.on('disconnect',function(){
		users.splice(socket.userIndex,1);
		socket.broadcast.emit('system',socket.nickname,users.length,'logout');
	});

	socket.on('postMsg',function(msg){
		socket.broadcast.emit('newMsg',socket.nickname,msg);
	});

	socket.on('img',function(imgData){
		socket.broadcast.emit('newImg',socket.nickname,imgData);
	});

});

