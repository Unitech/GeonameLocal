
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');
var mysql = require('mysql');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3002);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var client = mysql.createConnection({
    host     : '127.0.0.1',
    database : 'geonames',
    user     : 'root',
    password : 't32xor'
});

app.get('/', function(req, res) {
    res.send({success:true});
});


app.get('/cities15000', function(req, res) {
    var query = 'SELECT name, country_code, latitude, longitude from cities15000  WHERE name LIKE ' + client.escape('%' + req.query.city + '%') + ' LIMIT 10';
    client.query(query, function(err, rows, fields) {
	if (err) return res.send(500, err);
	return res.jsonp(rows);
    });
});

app.get('/cities5000/:city', function(req, res) {
    var query = 'SELECT name, country_code, latitude, longitude from cities5000 WHERE name LIKE ' + client.escape('%' + req.params.city + '%');
    client.query(query, function(err, rows, fields) {
	if (err) return res.send(500, err);
	return res.send(rows);
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
