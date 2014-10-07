var parse = require('csv-parse');
var fs = require('fs');
var zipObject = require('lodash-node/modern/arrays/zipObject');

var data = fs.readFileSync('./noonan_data.csv');
var Person = require('./models/person');

function trimValues(line) {
  Object.keys(line).forEach(function(key) {
    if (typeof(line[key]) === 'string') {
      line[key] = line[key].trim();
    }
  });
}

parse(data, {comment: '#'}, function(err, output){
  var labels = output.shift();
  output.forEach(trimValues);

  output.forEach(function(line) {
    var data = zipObject(labels, line);
    var person = new Person(data);
    person.save(function(err) { if (err) console.log(err.toString()); else console.log('successful'); });
  });
  
  console.log('done');
});

