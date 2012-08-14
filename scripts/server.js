var app = require('http').createServer(handler),
io  = require('socket.io').listen(app),
fs  = require('fs');
var path = require('path');

app.listen(3000);

var CONTENT_TYPE = "text/plain";
var FILE_NAME = "";

function handler(request, response) {

  var filePath = '.' + request.url;
  if (filePath == './')
    filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
    break;
    case '.css':
      contentType = 'text/css';
    break;
  }

  path.exists(filePath, function(exists) {

    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          response.writeHead(500);
          response.end();
        }
        else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
        }
      });
    }
    else {
      response.writeHead(404);
      response.end();
    }
  });

}


var CLIENTS = [];

io.sockets.on('connection', function (socket) {
  //socket.on('message', function () { });

  socket.on('addUser', function(data){
    socket.username = data;
    CLIENTS.push(data);
    socket.emit('updateClientList', data);
    io.sockets.emit('setClientList', CLIENTS);
  });


  socket.on('disconnect', function () { });
});
