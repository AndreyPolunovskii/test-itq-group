var express = require('express');
var path = require('path');
var app = express();
var cors = require('cors');
var minify = require('express-minify');

var fconfig = require("./src/fconfig.json");
var url_root = JSON.stringify(fconfig["urls"]["main"]).replace(/['"]+/g, '')

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
app.use(url_root+'/static',express.static(__dirname + "/"+type_project+"/static"));
app.use(express.static(path.join(__dirname, type_project)));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, type_project, 'index.html'));
});
app.get(url_root, function(req, res) {
  res.sendFile(path.join(__dirname, type_project, 'index.html'));
} );

////////////делаем активными роутинговые ссылки
app.get(url_root+'*', function(req, res) {
  res.sendFile(path.join(__dirname, type_project, 'index.html'));
} );

//////////////////////////////////

app.get(url_root+'/manifest.json', function(req, res) {
  res.sendFile(path.join(__dirname, type_project, 'manifest.json'));
} );

//console.log(express.static(path.join(__dirname, type_project)))


app.listen(3000);
