var app = require('http').createServer(handler),
io  = require('socket.io').listen(app),
fs  = require('fs');

app.listen(3000);

var CONTENT_TYPE = "text/plain";
var FILE_NAME = "";

function handler (req, res) {
  var file_ext = getFileType(req.url);
  FILE_NAME = req.url;

  setContentType(file_ext);
  setFileName(req.url);
  console.log(FILE_NAME + ' - ' + CONTENT_TYPE);

  fs.readFile(__dirname + FILE_NAME, 'utf-8',
              function (err, data) {
                if (err) {
                  res.writeHead(500);
                  return res.end('Error loading index.html');
                }

                res.writeHead(200, {'Content-Type' : CONTENT_TYPE});
                res.end(data);
              });
}


io.sockets.on('connection', function (socket) {

  socket.on('message', function () { });



  socket.on('disconnect', function () { });
});


function getFileType(filename){
  var re = /(?:\.([^.]+))?$/;
  var ext = re.exec(filename);
  return ext[ext.length -1];
}
function setContentType(file_ext){
  if(file_ext == "js"){
    CONTENT_TYPE = "text/javascript";
  }else if(file_ext == "css"){
    CONTENT_TYPE = "text/css";
  }else{
    CONTENT_TYPE = "text/html";
  }
}
function setFileName(url){
  if(url == "/"){
    FILE_NAME = '/client/index.html';
  }else{
    FILE_NAME = url;
  }
}
