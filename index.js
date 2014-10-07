var express = require('express');
var app = express();
var Person = require('./models/person');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/people/:id', function(req, res) {
  //res.setHeader('Content-Type', 'text/plain');
  //res.type('json');
  Person.findById(req.params.id, function(err, doc) {
    if (err) {
      res.json(err);
      return;
    }
    res.json(doc);
  });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
