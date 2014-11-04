var mongoose = require('./sources/mongoose')

var Person = mongoose.model('Person', {
  _id: String,
  'Characteristics': [String],
});

module.exports = Person;
