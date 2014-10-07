var mongoose = require('mongoose');

var conn = mongoose.connect('mongodb://localhost/phenontologic_search');

var Person = mongoose.model('Person', {
  _id: String,
  'Gender': String,
  'No Symptoms': Boolean,
  'Broad Webbed Neck': Boolean,
  'Characteristic facies': Boolean,
  'Cryptorchidism': Boolean,
  'Deafness': Boolean,
  'Developmental Delay': Boolean,
  'Hypertrophic cardiomyopathy': Boolean,
  'Low set nipples': Boolean,
  'Ocular findings?': String,
  'Other cardiac defect?': String,
  'Pectus excavatum/carinatum': String,
  'Pulmonary valve stenosis': Boolean,
  'Short stature': Boolean,
});

module.exports = Person;
