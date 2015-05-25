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
  return function(req, res) {
    req.log = bole(uuid.v4());
    req.log.info(req);
    var route = router.match(url.parse(req.url).pathname);
    req.on('end', function() {
      req.log.info({status: req.statusCode});
      req.log.info('End');
    });
    route.fn.apply(null, [req, res, route.params, route.splats, level]);
  };
};
