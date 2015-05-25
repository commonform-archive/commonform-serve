var concat = require('concat-stream');
var levelCommonform = require('level-commonform');
var routes = require('routes');
var url = require('url');
var uuid = require('uuid');

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

  router.addRoute('/forms', function formsRoute(request, response) {
    if (request.method === 'POST') {
      request.pipe(concat(function(buffer) {
        var form = JSON.parse(buffer);
        level.putForm(form, function(error, digest) {
          if (error) {
            response.statusCode = 400;
            response.end();
          } else {
            response.statusCode = 201;
            response.setHeader('location', '/forms/' + digest);
            response.end();
          }
        });
      }));
    } else {
      response.statusCode = 405;
      response.end();
    }
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
