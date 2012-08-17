var app = require('http').createServer(handler),
io  = require('socket.io').listen(app),
fs  = require('fs');
var path = require('path');

////////////////////////////////

 var redis = require("redis"),
        client = redis.createClient();

    // if you'd like to select database 3, instead of 0 (default), call
    // client.select(3, function() { /* ... */ });

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.set("string key", "string val", redis.print);
    client.hset("hash key", "hashtest 1", "some value", redis.print);
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    client.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });


 /////////////

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
