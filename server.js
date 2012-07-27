var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/client/index.html', 'utf-8',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(data);
  });
}


io.sockets.on('connection', function (socket) {

  socket.on('message', function () { });



  socket.on('disconnect', function () { });
});
