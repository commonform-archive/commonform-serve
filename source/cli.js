var docopt = require('docopt');
var fs = require('fs');
var path = require('path');

var meta = require('../package.json');
var usage = fs.readFileSync(path.join(__dirname, 'usage.txt'))
  .toString();

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
    throw new Error();
  }
};
