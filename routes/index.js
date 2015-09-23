var badMethodRoute = require('./bad-method');
var meta = require('../package.json');

function indexRoute(request, response) {
  if (request.method === 'GET') {
    response.setHeader('cache-control', 'no-store');
    response.end(JSON.stringify({
      service: meta.name,
      version: meta.version
    }));
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = indexRoute;
