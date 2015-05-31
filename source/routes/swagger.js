var badMethodRoute = require('./bad-method');
var swagger = require('../../swagger');

function swaggerRoute(request, response) {
  if (request.method === 'GET') {
    response.setHeader('cache-control', 'no-store');
    response.end(JSON.stringify(swagger));
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = swaggerRoute;
