$(document).ready(function() {
      var socket = io(), nickname, msgList = $('#messages');

      // Have a nickname?
      if('localStorage' in window && localStorage.getItem('nickname')) {
        nickname = localStorage.getItem('nickname');
      } else {
        // Ask if not
        nickname = prompt('Please enter your nickname');
        if('localStorage' in window) {
          localStorage.setItem('nickname', nickname);
        }
      }  

      // Send a message to the server
      socket.emit('join', nickname);

      // Add message 
      var newMessage = function(data) {
        var who = $('<div class="who">').text(data.nickname),
            when = $('<div class="when">').text(new Date().toString().substr(0, 24)),
            msg = $('<div class="msg">').text(data.msg),
            header = $('<div class="header clearfix">').append(who).append(when),
            li = $('<li>').append(header).append(msg);    

        msgList.prepend(li);
      };

      // Check the message form
      $('form').submit(function(e) {
        var msgField = $('#msg'),        
            data = { msg: msgField.val(), nickname: nickname, when: new Date() };

        e.preventDefault();
        // Send to the socket.io server
        socket.emit('msg', data);
        // Add message to the page
        newMessage(data);
        // Clear
        msgField.val('');    
      });  

     
      socket.on('msg', function(data) { newMessage(data); });

      
      socket.on('notice', function(msg) {
        msgList.prepend($('<div class="notice">').text(msg));
      });
    });