var badMethodRoute = require('./bad-method');
var notFoundRoute = require('./not-found');
var version = require('../../package').version;

function getFormsRoute(request, response, parameters, splats, level) {
  if (request.method === 'GET') {
    var digest = parameters.id;
    level.getForm(digest, function(error, form) {
      if (error) {
        if (error.notFound) {
          notFoundRoute(request, response);
        } else {
          request.log.error(error);
          response.statusCode = 500;
          response.end();
        }
      } else {
        var json = {digest: digest, form: form, version: version};
        request.log.info(json);
        response.end(JSON.stringify(json));
      }
    });
  } else {
    badMethodRoute(request, response);
  }
}

module.exports = getFormsRoute;
