var router = require('http-hash')();

require('./routes/handlers')
  .forEach(function(handler) {
    router.set(handler.pattern, handler.function);
  });

var namespaceRoute = require('./routes/namespace');
require('./routes/namespaces')
  .forEach(function(plural) {
    router.set('/' + plural, namespaceRoute(plural));
  });

var searchRoute = require('./routes/search');
require('./routes/searches')
  .forEach(function(search) {
    router.set(
      '/' + search.object.plural + '/:id/' + search.noun.plural,
      searchRoute(search)
    );
  });

module.exports = router;
