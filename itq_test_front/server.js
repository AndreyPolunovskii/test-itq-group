var express = require('express');
var path = require('path');
var app = express();
var cors = require('cors');
var minify = require('express-minify');
var proxy = require('express-http-proxy');

app.use(cors())

var type_project = 'build'

app.use(minify({
  cache: false,
  uglifyJsModule: null,
  errorHandler: null,
  jsMatch: /javascript/,
  cssMatch: /css/,
  jsonMatch: /json/,
  sassMatch: /scss/,
  lessMatch: /less/,
  stylusMatch: /stylus/,
  coffeeScriptMatch: /coffeescript/,
}));

app.options('*', cors())
app.use('/static',express.static(__dirname + "/"+type_project+"/static"));
app.use(express.static(path.join(__dirname, type_project)));

//////////////////////////////////

app.get('/manifest.json', function(req, res) {
  res.sendFile(path.join(__dirname, type_project, 'manifest.json'));
} );

//////////////////////////////////
//проксируем нашу api
app.use('/api/v1.0', proxy('http://itq_test_backend_api:5000/'))

//console.log(express.static(path.join(__dirname, type_project)))

//////////////////////////////////
//для всех отсальных главная страница

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, type_project, 'index.html'));
});


app.listen(3000);
