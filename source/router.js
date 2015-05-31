var router = require('http-hash')();

require('./handlers')
  .forEach(function(handler) {
    router.set(handler.pattern, handler.function);
  });

var namespaceRoute = require('./routes/namespace');
require('./namespaces')
  .forEach(function(plural) {
    router.set('/' + plural, namespaceRoute(plural));
  });

var searchRoute = require('./routes/search');
require('./searches')
  .forEach(function(search) {
    router.set(
      '/' + search.object.plural + '/:id/' + search.noun.plural,
      searchRoute(search)
    );
  });

module.exports = router;
