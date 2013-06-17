// Load the http module to create an http server.
var http = require('http')
var jade = require('jade')
var fs = require('fs')
var express = require('express');

var app = express();
app.configure(function() {
  app.use(
    "/",
    express.static(__dirname)
  );
});

//app.use(express.logger());

// Configure our HTTP server to respond with Hello World to all requests.
app.get('/', function (request, response) {
  res.send(fs.readFileSync(__dirname + '/main.html'));
});

var browser_io = require('socket.io').listen(8001);
var android_io = require('socket.io').listen(8002);

var gpsData = [];

browser_io.sockets.on('connection', function (socket) {
  socket.on('refresh', function (data) {
    socket.emit('update', gpsData);
  });
  socket.on('android_update', function(data) {
  });
});


android_io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    console.log(data);
    gpsData.push(data);
    browser_io.sockets.emit('android_update', data);
  });
});

// Listen on port 8000, IP defaults to 127.0.0.1
app.listen(8000);



// Put a friendly message on the terminal
console.log('Express server started');

