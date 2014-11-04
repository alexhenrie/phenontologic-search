var fs = require('fs');

var data = fs.readFileSync('./noonan_data.tsv', 'utf8');
var Person = require('./models/person');

data.split('\n').forEach(function(line) {
    if (line.length == 0)
      return;

    var columns = line.split('\t');
    var person = new Person({_id: columns[0], Characteristics: columns[1].split(';')});
    person.save(function(err) {
      if (err) console.log(err);
    });
  }
);
