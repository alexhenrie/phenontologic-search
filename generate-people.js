var Person = require('./models/person');
var uuid = require('node-uuid');

for (var i = 0; i < 10; i++) {
  var characteristics = [];
  for (var j = 0; j < Math.random() * 10; j++) {
    var hpoId = Math.floor(Math.random() * 10000);
    characteristics.push('HP:' + ('0000000' + hpoId).slice(-7));
  }
  var person = new Person({_id: uuid.v4(), Characteristics: characteristics});
  person.save(function(err) {
    if (err) console.log(err);
  });
}
