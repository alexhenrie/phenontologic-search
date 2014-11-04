var fs = require('fs');

var data = fs.readFileSync('./hp.obo', 'utf8');
var Term = require('./models/term');

var term = null;

data.split('\n').forEach(function(line) {
  if (line == '[Term]') {
    term = {};
    return;
  } else if (line == '') {
    if (term) {
      var termObj = new Term(term);
      console.log('saving ' + term._id);
      termObj.save();
      term = null;
    }
  }

  if (term) {
    var tokens = /(.*): (.*)/.exec(line);
    if (tokens[1] == 'id') {
      term._id = tokens[2];
    } else if (tokens[1] == 'name') {
      term.Name = tokens[2];
    } else if (tokens[1] == 'def') {
      term.Description = tokens[2];
    }
  }
});
