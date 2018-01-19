var sio = require('socket.io');
var io = null;
var connections = [];

module.exports.io = function(){

	return io;
	
}

module.exports.init = function(server){

	io = sio(server);


	io.on('connection', function(socket) {

		connections.push(socket);
		console.log('Connected: %s sockets connected',connections.length);

		//Disconnect
		socket.on('disconnect',function(){

			connections.splice(connections.indexOf(socket),1)
			console.log('Disconnected: %s sockets connected',connections.length);
		})

		


	});

}






