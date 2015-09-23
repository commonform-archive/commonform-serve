var levelCommonform = require('level-commonform');
var notFoundRoute = require('./routes/not-found');
var router = require('./router');
var url = require('url');
var uuid = require('uuid');

// Generate an HTTP request handler, given a bole logger and a
// LevelUp-compatible data store.
function requestHandler(bole, levelup) {

  // Wrap Common Form-specific data storage around the provided
  // LevelUp-compatible data store.
  var level = levelCommonform(levelup);

  return function(request, response) {
    // Create a logger for each request, using a UUID, and bind it to a
    // property of the request object.
    request.log = bole(uuid.v4());
    request.log.info(request);

    // Ensure that the end of the request and resulting HTTP status are
    // logged, regardless of routing.
    request
      .on('end', function() {
        request.log.info({status: response.statusCode});
        request.log.info({event: 'end'});
      });

    // Route the request to the appropriate handler.
    var parsed = url.parse(request.url, true);
    var route = router.get(parsed.pathname);
    if (route.handler) {
      route.handler.apply(null, [
        request,
        response,
        // Decode URL parameters.
        Object.keys(route.params)
          .reduce(function(params, key) {
            params[key] = decodeURIComponent(route.params[key]);
            return params;
          }, {}),
        route.splat,
        level,
        parsed.query
      ]);

    // The router did not match to a request handler.
    } else {
      notFoundRoute(request, response);
    }
  };
}

module.exports = requestHandler;
