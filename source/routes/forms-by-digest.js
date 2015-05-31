var badMethodRoute = require('./bad-method');
var internalErrorRoute = require('./internal-error');
var notFoundRoute = require('./not-found');
var version = require('../../package').version;

function formsByDigestRoute(request, response, parameters, _, level) {
  if (request.method === 'GET') {
    var digest = parameters.id;
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
