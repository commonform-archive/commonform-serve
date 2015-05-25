var package = require('..');

require('tap').test('package', function(test) {
  test.equal(typeof package, 'function');
  test.equal(package.length, 2);
  test.end();
});
