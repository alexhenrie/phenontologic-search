var mongoose = require('./sources/mongoose');

var Term = mongoose.model('Term', {
  _id: String,
  'Name': String,
  'Definition': String,
});

module.exports = Term;
