var badMethodRoute = require('./bad-method');
var url = require('url');

function digestsRoute(request, response, parameters, splats, level) {
  if (request.method === 'GET') {
    var query = url.parse(request.url, true).query;
    var prefix = query.prefix;
    var first = true;
    response.write('[');
    level.createDigestsReadStream(prefix)
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
}

module.exports = digestsRoute;
