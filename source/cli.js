var bole = require('bole');
var docopt = require('docopt');
var fs = require('fs');
var http = require('http');
var join = require('path').join;
var leveldown = require('leveldown');
var levelup = require('levelup');

var handler = require('..');
var meta = require('../package.json');
var usage = fs.readFileSync(join(__dirname, 'usage.txt')).toString();

var defaultDataPath = function() {
  return join(process.cwd(), '.commonform');
};

module.exports = function(stdin, stdout, stderr, env, argv, callback) {
  var options;
  try {
    options = docopt.docopt(usage, {
      argv: argv,
      help: false,
      exit: false
    });
  } catch (error) {
    stderr.write(error.message);
    callback(1);
    return;
  }
  if (options['--version'] || options['-v']) {
    stdout.write(meta.name + ' ' + meta.version + '\n');
    callback(0);
  } else if (options['--help'] || options['-h']) {
    stdout.write(usage + '\n');
    callback(0);
  } else {
    var dataPath = options.DATA_PATH || defaultDataPath();
    var level = levelup(dataPath, {db: leveldown});
    bole.output({level: 'debug', stream: stdout});
    var log = bole(meta.name);
    var port = options.PORT || 0;
    http.createServer(handler(log, level))
      .on('listening', function() {
        log.info('Listening on port ' + this.address().port);
        log.info('Writing to ' + dataPath);
      })
      .on('close', callback.bind(this, 0))
      .listen(port);
  }
};
