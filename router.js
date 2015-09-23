var router = require('http-hash')();

// Bind core request handlers.
require('./routes/handlers')
  .forEach(function(handler) {
    router.set(handler.pattern, handler.function);
  });

module.exports = router;
