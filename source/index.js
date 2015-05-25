var routes = require('routes');
var levelCommonform = require('level-commonform');
var uuid = require('uuid');
var url = require('url');

var meta = require('../package.json');

module.exports = function(bole, levelup) {
  var level = levelCommonform(levelup);
  var router = routes();

  router.addRoute('/', function indexRoute(request, response) {
    response.setHeader('cache-control', 'no-store');
    response.end(JSON.stringify({
      service: meta.name,
      version: meta.version
    }));
    request.log.info('Done');
  });

  router.addRoute('*', function notFoundRoute(request, response) {
    response.statusCode = 404;
    response.end();
  });

  return function(req, res) {
    req.log = bole(uuid.v4());
    req.log.info(req);
    var route = router.match(url.parse(req.url).pathname);
    route.fn.apply(null, [req, res, route.params, route.splats]);
  };
};
