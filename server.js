var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));
app.use('/scripts',  express.static(path.join(__dirname, 'scripts')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + 'index.html'));
});

app.listen(process.env.PORT || 3000);
