var users = [];

var requestedgameuser= {};

module.exports = function (io) {
  io.on('connection', function (socket) {


      console.log(socket.id)
      /// a new playe comes

      // store in the user list

      users.push({
        name : socket.handshake.query.name,
        id: socket
      })


      // send a message about all requestd users
       socket.emit('gamerequest', requestedgameuser);;





      // event send by user to create his game room
      socket.on('creategameroom', function (roomname) {
      socket.join(roomname + '_' + socket.id)
      requestedgameuser[roomname + '_' + socket.id] = {
        name: roomname,
        gameid: roomname + '_' + socket.id
      };

      //broadcast list to all the users
    socket.broadcast.emit('gamerequest', requestedgameuser);

    });

      // event send by user to create his game room
      socket.on('acceptchallenge', function (gameid) {
      socket.join(gameid)

     //send message to both the users to continue
    socket.broadcast.to(gameid).emit('message','Please start playing');

      delete requestedgameuser[gameid];
      //broadcast list to all the users
        socket.broadcast.emit('gamerequest', requestedgameuser);

    });


    /*socket.on('join', function(room) {
      socket.join(room);
      socket.on('message', function(msg) {
        socket.broadcast.to(room).emit('message', msg);
      });
    });*/
   /* socket.emit('message', { user: 'Server', message:'Welcome to harish quich chat service :P' });
    socket.on('message', function (data) {
      console.log('again');
      //socket.broadcast.emit('message', data);
      io.sockets.emit('message', data);
    });*/
  });
}
