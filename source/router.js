var router = require('routes')();

require('./handlers')
  .forEach(function(handler) {
    router.addRoute(handler.pattern, handler.function);
  });

var namespaceRoute = require('./routes/namespace');
require('./namespaces')
  .forEach(function(plural) {
    router.addRoute('/' + plural, namespaceRoute(plural));
  });

var searchRoute = require('./routes/search');
require('./searches')
  .forEach(function(search) {
    router.addRoute(
      '/' + search.object.plural + '/:name/' + search.noun.plural,
      searchRoute(search)
    );
  });

router.addRoute('*', require('./routes/not-found'));

module.exports = router;
