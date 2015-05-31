var levelCommonform = require('level-commonform');
var url = require('url');
var uuid = require('uuid');
var router = require('./router');
var notFoundRoute = require('./routes/not-found');

function requestHandler(bole, levelup) {
  var level = levelCommonform(levelup);

  return function(request, response) {
    request.log = bole(uuid.v4());
    request.log.info(request);
    request
      .on('end', function() {
        request.log.info({status: response.statusCode});
        request.log.info({event: 'end'});
      });
    var parsed = url.parse(request.url, true);
    var route = router.get(parsed.pathname);
    if (route.handler) {
      route.handler.apply(null, [
        request,
        response,
        Object.keys(route.params)
          .reduce(function(params, key) {
            params[key] = decodeURIComponent(route.params[key]);
            return params;
          }, {}),
        route.splat,
        level,
        parsed.query
      ]);
    } else {
      notFoundRoute(request, response);
    }
  };
}

module.exports = requestHandler;
