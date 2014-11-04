var mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://localhost/phenontologic_search');

module.exports = mongoose;
