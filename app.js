var express = require('express');

var app = express();
var server = require('http').createServer(app);

server.listen(1337);

var tenz = function tenzRoute(req, res){
	res.sendfile('./index.html');
};

app.use('/',express.static(__dirname));

app.get('/',tenz);