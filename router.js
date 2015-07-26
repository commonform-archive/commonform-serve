var router = require('http-hash')();

// Bind core request handlers.
require('./routes/handlers')
  .forEach(function(handler) {
    router.set(handler.pattern, handler.function);
  });

// Generate request handlers to serve lists of items from various
// namespaces, like terms and headings.
var namespaceRoute = require('./routes/namespace');
require('./routes/namespaces')
  .forEach(function(plural) {
    router.set('/' + plural, namespaceRoute(plural));
  });

// Generate request handlers for various relationship-based searches,
// such as all definitions of a given term.
var searchRoute = require('./routes/search');
require('./routes/searches')
  .forEach(function(search) {
    router.set(
      '/' + search.object.plural + '/:id/' + search.noun.plural,
      searchRoute(search)
    );
  });

module.exports = router;
