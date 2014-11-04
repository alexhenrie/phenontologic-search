var express = require('express');
var app = express();
var Person = require('./models/person');
var Promise = require('es6-promise').Promise;
var exec = require('child_process').exec;
var fs = require('fs');
var tmp = require('tmp');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/api/people/:id', function(req, res) {
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

app.get('/api/people', function(req, res) {
  var scores = {};
  Person.find({}, function(err, doc) {
    var promises = doc.map(function(person) {
      return new Promise(function(resolve, reject) {
        tmp.dir(function(err, path) {
          var inputQueries = 'i1\tHP:0000271\n' +
            'i2\t' + person.Characteristics.join(';') + '\n';
          fs.writeFileSync(path + '/instance_annots.tsv', inputQueries);

          var xmlConf = '<?xml version="1.0" encoding="UTF-8"?>\
<sglib>\
    <opt threads="1" />\
    <namespaces>\
        <nm prefix="HP" ref="http://purl.obolibrary.org/obo/hp.owl#HP_" />\
    </namespaces>\
    <graphs>\
        <graph uri="http://bio/">\
            <data>\
                <file format="OBO" path="' + __dirname + '/hp.obo" />\
                <file format="TSV_ANNOT" path="instance_annots.tsv" prefixSubject="http://bio/" header="false" />\
            </data>\
            <actions>\
                <action type="VERTICES_REDUCTION" root_uri="http://purl.obolibrary.org/obo/hp.owl#HP_0000001" />\
                <action type="TRANSITIVE_REDUCTION" target="CLASSES" />\
            </actions>\
        </graph>\
    </graphs>\
    <sml module="sm" graph="http://bio/">\
        <opt_module threads="1" />\
        <measures type="groupwise">\
            <measure id="ui" flag="SIM_GROUPWISE_DAG_UI" />\
        </measures>\
        <queries id="query" type="oTOo" file="' + __dirname + '/input_queries.tsv" output="' + path + '/output.tsv" noAnnots="set=-1" notFound="exclude" output_basename="false" uri_prefix="http://bio/" />\
    </sml>\
</sglib>';
          fs.writeFileSync(path + '/sml-xmlconf.xml', xmlConf);

          exec('java -jar ' + __dirname + '/sml-toolkit-0.9.jar -t sm -xmlconf sml-xmlconf.xml', {cwd: path}, function callback(error, stdout, stderr) {
            console.log('execution complete');
            console.log(stdout);
            var score = /i1\ti2\t([0-9.]+)/.exec(fs.readFileSync(path + '/output.tsv'))[1];

            scores[person._id] = score;
            resolve();
          });
        });
      });
    });
    Promise.all(promises).then(function() {
      res.json(scores);
    });
  });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
