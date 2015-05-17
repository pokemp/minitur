   // Express app
    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    http.listen(process.env.PORT || 3000);

    // Setting Jade
    var path = require('path');
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.static(path.join(__dirname, 'public')));

    // Check HTTP GET to URL «/»
    app.get('/', function(req, res) {
      res.render('index');
    });

     // socket.io listening message
    io.on('connection', function(socket) {  
      // Everybody can see the message
      socket.on('msg', function(data) {        
        socket.broadcast.emit('msg', data);        
      });

      //Adding some chat function when someone connect
      socket.on('join', function(nickname) {
        // Add nickname
        socket.nickname = nickname;
        socket.broadcast.emit('notice', nickname + ' has joined the chat.');
      });

      //When someone disconnect
      socket.on('disconnect', function() {
        socket.broadcast.emit('notice', socket.nickname + ' has left the chat.');
      });
    });