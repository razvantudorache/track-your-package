'use strict';

module.exports = function (server) {
  var io = require("socket.io")(server);
  var users = {},
    socks = {},
    lastUserId = 0;

  //Handle users
  io.on('connection', function (socket) {

    // Event received by new user
    socket.on('join', function (user, callbackFn) {

      if (!user.extId) {
        socket.emit('custom_error', {message: 'User not found or invalid'});
        return;
      }

      socket.extId = user.extId;

      // The user is already logged
      if (users[user.extId]) {
        socket.emit('custom_error', {message: 'The user ' + user.extId + ' is already logged'});
      } else {
        // Set new user id
        var newUserId = lastUserId++;

        // Add the new data user
        users[socket.extId] = {
          'userId': newUserId,
          'extId': socket.extId,
          'name': user.name,
          'avatar': user.avatar,
          'status': 'online'
        };
        socks[socket.extId] = {'socket': socket};

        // Send new user is connected to everyone
        socket.broadcast.emit('chat', JSON.stringify({
          'action': 'newuser',
          'user': users[socket.extId],
          'numberOfUsers': Object.keys(users).length
        }));
      }

      // If there is users online, send the list of them
      if (Object.keys(users).length > 0) {
        socket.emit('chat', JSON.stringify({
          'action': 'userlist',
          'users': users,
          'numberOfUsers': Object.keys(users).length
        }));
      }

      if (typeof callbackFn !== 'undefined') {
        callbackFn(JSON.stringify({'login': 'successful', 'details': users[socket.extId]}));
      }
    });

    // Event received when user is typing
    socket.on('user_typing', function (user) {
      var id = socks[user.extId].socket.id;

      //used when a user is chatting with himself
      if (user.extId !== socket.extId) {
        io.sockets.connected[id].emit('chat', JSON.stringify({
          'action': 'user_typing',
          'data': users[socket.extId]
        }));
      }
    });

    // Event received when user send message to another
    socket.on('message', function (user, fn) {

      var date = new Date();
      if (typeof fn !== 'undefined') {
        fn(JSON.stringify({'ack': 'true', 'date': date}));
      }
      //used when a user is chatting with himself
      if (user.extId !== socket.extId) {
        var id = socks[user.extId].socket.id;
        var msg = {'msg': user.msg, 'user': users[socket.extId]};

        io.sockets.connected[id].emit('chat', JSON.stringify({
          'action': 'message',
          'data': msg,
          'date': date
        }));
      }
    });

    // Event received when user has disconnected
    socket.on('disconnect', function () {
      if (users[socket.extId]) {
        var deletedUser = users[socket.extId];

        delete users[socket.extId];
        delete socks[socket.extId];

        socket.broadcast.emit('chat', JSON.stringify({
          'action': 'disconnect',
          'user': deletedUser,
          'numberOfUsers': Object.keys(users).length
        }));
      }
    });
  });
};

