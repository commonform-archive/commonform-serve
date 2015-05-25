var badMethodRoute = require('./bad-method');
var notFoundRoute = require('./not-found');

function getFormsRoute(request, response, parameters, splats, level) {
  if (request.method === 'GET') {
    level.getForm(parameters.digest, function(error, form) {
      if (error) {
        if (error.notFound) {
          notFoundRoute(request, response);
        } else {
          request.log.error(error);
          response.statusCode = 500;
          response.end();
        }
      } else {
        request.log.info(form);
        response.end(JSON.stringify(form));
      }
    });
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = getFormsRoute;
