var handler = require('..');

require('tap').test('package', function(test) {
  test.equal(typeof handler, 'function');
  test.equal(handler.length, 2);
  test.end();
});
