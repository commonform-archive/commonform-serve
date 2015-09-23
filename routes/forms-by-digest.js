var badMethodRoute = require('./bad-method');
var internalErrorRoute = require('./internal-error');
var notFoundRoute = require('./not-found');
var version = require('../package.json').version;

function formsByDigestRoute(request, response, digest, level) {
  if (request.method === 'GET') {
    level.getForm(digest, function(error, form) {
      if (error) {
        if (error.notFound) {
          notFoundRoute(request, response);
        } else {
          internalErrorRoute(error, request, response);
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

module.exports = formsByDigestRoute;
