var levelCommonform = require('level-commonform');
var routes = require('routes');
var url = require('url');
var uuid = require('uuid');

var getFormsRoute = require('./routes/get-forms');
var indexRoute = require('./routes/index');
var notFoundRoute = require('./routes/not-found');
var postFormsRoute = require('./routes/post-forms');

module.exports = function(bole, levelup) {
  var level = levelCommonform(levelup);
  var router = routes();
  router.addRoute('/', indexRoute);
  router.addRoute('/forms', postFormsRoute);
  router.addRoute('/forms/:digest', getFormsRoute);
  router.addRoute('*', notFoundRoute);
  return function(request, response) {
    request.log = bole(uuid.v4());
    request.log.info(request);
    var route = router.match(url.parse(request.url).pathname);
    request.on('end', function() {
      request.log.info({status: response.statusCode});
      request.log.info('End');
    });
    route.fn.apply(null, [
      request, response, route.params, route.splats, level
    ]);
  };
};
