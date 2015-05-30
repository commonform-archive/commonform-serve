var levelCommonform = require('level-commonform');
var url = require('url');
var uuid = require('uuid');
var router = require('./router');

function requestHandler(bole, levelup) {
  var level = levelCommonform(levelup);

  return function(request, response) {
    request.log = bole(uuid.v4());
    request.log.info(request);
    var parsed = url.parse(request.url, true);
    var route = router.match(parsed.pathname);
    request
      .on('end', function() {
        request.log.info({status: response.statusCode});
        request.log.info({event: 'end'});
      });
    route.fn.apply(null, [
      request, response, route.params, route.splats, level, parsed.query
    ]);
  };
}

module.exports = requestHandler;
