var levelCommonform = require('level-commonform');
var routes = require('routes');
var url = require('url');
var uuid = require('uuid');

var handlers = {
  '/': require('./routes/index'),
  '/forms': require('./routes/forms'),
  '/forms/:digest': require('./routes/forms-by-digest'),
  '/bookmarks/:bookmark': require('./routes/bookmarks')
};

var namespaceRoute = require('./routes/namespace');
var definitionsRoute = require('./routes/definitions');
var notFoundRoute = require('./routes/not-found');

function requestHandler(bole, levelup) {
  var level = levelCommonform(levelup);

  var router = routes();
  Object.keys(handlers)
    .forEach(function(pattern) {
      router.addRoute(pattern, handlers[pattern]);
    });
  ['blanks', 'bookmarks', 'digests', 'headings', 'terms']
    .forEach(function(plural) {
      router.addRoute('/' + plural, namespaceRoute(plural));
    });
  router.addRoute('/terms/:term/definitions', definitionsRoute);
  router.addRoute('*', notFoundRoute);

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
