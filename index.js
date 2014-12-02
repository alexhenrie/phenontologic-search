var express = require('express');
var app = express();
var Person = require('./models/person');
var Promise = require('es6-promise').Promise;
var Term = require('./models/term');
var exec = require('child_process').exec;
var fs = require('fs');
var tmp = require('tmp');

app.get('/api/people', function(req, res) {
  Person.find({}, function(err, doc) {
    var promises = doc.map(function(person) {
      return new Promise(function(resolve, reject) {
        tmp.dir(function(err, path) {
          var inputQueries = 'i1\t' + req.query.query + '\n' +
            'i2\t' + person.Characteristics.join(';') + '\n';
          fs.writeFileSync(path + '/instance_annots.tsv', inputQueries);

          var metricFlags = {
            ali:      'SIM_GROUPWISE_DAG_ALI_DEANE',
            bader:    'SIM_FRAMEWORK_DAG_SET_BADER_2003',
            blanquet: 'SIM_FRAMEWORK_DAG_SET_BRAUN_BLANQUET_1932',
            dice:     'SIM_FRAMEWORK_DAG_SET_DICE_1945',
            knappe:   'SIM_FRAMEWORK_DAG_SET_KNAPPE_2004',
            korbel:   'SIM_FRAMEWORK_DAG_SET_KORBEL_2002',
            lee:      'SIM_GROUPWISE_DAG_LEE_2004',
            maryland: 'SIM_FRAMEWORK_DAG_SET_MARYLAND_BRIDGE_2003',
            nto:      'SIM_GROUPWISE_DAG_NTO',
            nto_max:  'SIM_GROUPWISE_DAG_NTO_MAX',
            ochiai:   'SIM_FRAMEWORK_DAG_SET_OCHIAI_1957',
            simlp:    'SIM_GROUPWISE_DAG_LP',
            simpson:  'SIM_FRAMEWORK_DAG_SET_SIMPSON_1960',
            simui:    'SIM_GROUPWISE_DAG_UI',
            sokal:    'SIM_FRAMEWORK_DAG_SET_SOKAL_SNEATH_1963',
            to:       'SIM_GROUPWISE_DAG_TO',
            tversky:  'SIM_FRAMEWORK_DAG_SET_TVERSKY_1977',
          };
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
            <measure id="" flag="' + metricFlags[req.query.metric] + '" />\
        </measures>\
        <queries id="query" type="oTOo" file="' + __dirname + '/input_queries.tsv" output="' + path + '/output.tsv" noAnnots="set=-1" notFound="exclude" output_basename="false" uri_prefix="http://bio/" />\
    </sml>\
</sglib>';
          fs.writeFileSync(path + '/sml-xmlconf.xml', xmlConf);

          exec('java -jar ' + __dirname + '/sml-toolkit-0.9.jar -t sm -xmlconf sml-xmlconf.xml', {cwd: path}, function callback(error, stdout, stderr) {
            if (error) {
              return reject(error.code);
            }

            var score = /i1\ti2\t([0-9.]+)/.exec(fs.readFileSync(path + '/output.tsv'));
            if (!score) {
              return reject();
            }
            score = parseFloat(score[1]);

            //return the person ID, score, and description of characteristics
            Promise.all(person.Characteristics.map(function(characteristicId) {
              return new Promise(function(resolve, reject) {
                Term.findOne({_id: characteristicId}, function(err, row) {
                  if (err || !row)
                    resolve();
                  else
                    resolve(row.Name);
                });
              });
            })).then(function(characteristics) {
              characteristics = characteristics.filter(function(characteristic) {
                return characteristic;
              });
              resolve({name: person._id, value: score, characteristics: characteristics});
            });
          });
        });
      });
    });
    Promise.all(promises).then(function(scores) {
      scores.sort(function(x, y) {
        if (x.value < y.value)
          return 1;
        else if (x.value > y.value)
          return -1;
        else
          return 0;
      });
      res.json(scores);
    }).catch(function(code) {
      res.status(500).send('Error code: ' + code);
    });
  });
});

app.get('/api/term', function(req, res) {
  if (!req.query.query) {
    res.status(500).send();
    return;
  }

  Term.findOne({_id: req.query.query}, function(err, row) {
    res.json({id: row._id, name: row.Name});
  });
});

app.get('/api/terms', function(req, res) {
  if (!req.query.query) {
    res.status(500).send();
    return;
  }

  var regex = new RegExp(req.query.query.replace(/([\\{}()|.?*+\-\^$\[\]])/g, '\\$1'), 'i');
  Term.find({}, function(err, doc) {
    doc = doc.filter(function(row) {
      return regex.test(row.Name) || regex.test(row._id);
    });
    doc = doc.map(function(row) {
      return {id: row._id, name: row.Name}
    });
    res.json(doc);
  });
});

app.use(express.static(__dirname + '/assets'));
app.use('/dist', express.static(__dirname + '/dist'));

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
