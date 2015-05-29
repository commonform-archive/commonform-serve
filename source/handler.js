var levelCommonform = require('level-commonform');
var routes = require('routes');
var url = require('url');
var uuid = require('uuid');

var bookmarksRoute = require('./routes/bookmarks');
var digestsRoute = require('./routes/digests');
var formsByDigestRoute = require('./routes/forms-by-digest');
var formsRoute = require('./routes/forms');
var indexRoute = require('./routes/index');
var notFoundRoute = require('./routes/not-found');

function requestHandler(bole, levelup) {
  var level = levelCommonform(levelup);
  var router = routes();
  router.addRoute('/', indexRoute);
  router.addRoute('/forms', formsRoute);
  router.addRoute('/forms/:digest', formsByDigestRoute);
  router.addRoute('/bookmarks/:bookmark', bookmarksRoute);
  router.addRoute('/digests', digestsRoute);
  router.addRoute('*', notFoundRoute);
  return function(request, response) {
    request.log = bole(uuid.v4());
    request.log.info(request);
    var route = router.match(url.parse(request.url).pathname);
    request.on('end', function() {
      request.log.info({status: response.statusCode});
      request.log.info({event: 'end'});
    });
    route.fn.apply(null, [
      request, response, route.params, route.splats, level
    ]);
  };
}

module.exports = requestHandler;
