var badMethodRoute = require('./bad-method');

function digestsRoute(request, response, parameters, splats, level) {
  if (request.method === 'GET') {
    var prefix = parameters.prefix || '';
    var digests = [];
    level.createDigestsReadStream(prefix)
      .on('data', function(digest) {
        digests.push(digest);
      })
      .on('end', function() {
        response.end(JSON.stringify(digests));
      });
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = digestsRoute;
