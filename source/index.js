var uuid = require('uuid');
var levelCommonform = require('level-commonform');

var meta = require('../package.json');

module.exports = function(bole, levelup) {
  var level = levelCommonform(levelup);
  return function(request, response) {
    request.log = bole(uuid.v4());
    request.log.info(request);
    response.setHeader('cache-control', 'no-store');
    response.end(JSON.stringify({
      service: meta.name,
      version: meta.version
    }));
    request.log.info('Done');
  };
};
