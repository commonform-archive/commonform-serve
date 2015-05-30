var badMethodRoute = require('./bad-method');
var url = require('url');

module.exports = function(type) {
  var capitalized = type[0].toUpperCase() + type.slice(1);
  return function(request, response, parameters, splats, level) {
    if (request.method === 'GET') {
      var query = url.parse(request.url, true).query;
      var prefix = query.prefix;
      var first = true;
      response.write('[');
      level['create' + capitalized + 'ReadStream'](prefix)
        .on('data', function(digest) {
          response.write((first ? '' : ',') + JSON.stringify(digest));
          first = false;
        })
        .on('end', function() {
          response.end(']');
        });
    } else {
      badMethodRoute(request, response);
    }
  };
};
