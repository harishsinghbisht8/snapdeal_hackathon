var gamelogic = require('../logic.js');

var redis = require('redis');

var redisClient = redis.createClient(15970, 'pub-redis-15970.us-east-1-2.1.ec2.garantiadata.com');

  // REDIS Events
    redisClient.on('connect', function() {
      console.log('hello there')
    });

  redisClient.on('disconnected', function(err) {

    });

  redisClient.on('error', function(err) {

    });

redisClient.on('end', function(err) {

    });

var users = {};

var requestedgameuser= {};

var ongoinggame = {}

module.exports = function (io) {
  io.on('connection', function (socket) {


      console.log(socket.id)
      /// a new playe comes

      // store in the user list

      users[socket.id] = {
        name : socket.handshake.query.name,
        id: socket.id,
        game : []
      };


      // send a message about all requestd users
       socket.emit('gamerequest', requestedgameuser);





      // event send by user to create his game room
      socket.on('creategameroom', function (roomname) {

          console.log('i am here')
      socket.join(roomname + '_' + socket.id)
      requestedgameuser[roomname + '_' + socket.id] = {
        name: roomname,
        gameid: roomname + '_' + socket.id,
          creator: socket.id
      };

          users[socket.id].game.push(roomname + '_' + socket.id);
      //broadcast list to all the users
    socket.broadcast.emit('gamerequest', requestedgameuser);
    socket.emit('gamecreated', roomname + '_' + socket.id);
    });

      // event send by user to accept a game challenge
      socket.on('acceptchallenge', function (gameid) {
      socket.join(gameid)

     //send message to both the users to continue
    io.sockets.in(gameid).emit('message','Please start playing');

      delete requestedgameuser[gameid];
      //broadcast list to all the users

        socket.broadcast.emit('gamerequest', requestedgameuser);

    });


        // event send by user to distroy his game room
      socket.on('closegame', function (gameid) {

          if(socket.id === requestedgameuser[gameid].creator) {
            delete requestedgameuser[gameid];
          }
        //broadcast list to all the users
        socket.broadcast.emit('gamerequest', requestedgameuser);

    });

    socket.on('move', function(data) {
        //check for result

        var moveresult = gamelogic(data)
        console.log(moveresult)
        if(moveresult.result === "draw") {
            io.sockets.in(data.gameid).emit('move',JSON.stringify(moveresult));
        } else if((moveresult.result === "won")){
            moveresult.result === data.currentMove + '';
            io.sockets.in(data.gameid).emit('move',JSON.stringify(moveresult));
        }
        else {
            socket.broadcast.to(data.gameid).emit('move',JSON.stringify(moveresult));
        }

    });

      socket.on('disconnect', function () {

          //delete all the created game
          var games = users[socket.id].game;

          games.forEach(function(gameid){
            delete requestedgameuser[gameid];
          });

           delete users[socket.id];
          //notify to all users
          socket.broadcast.emit('gamerequest', requestedgameuser);

          //send message to competetor that you won if a game is on

        });

  });
}
