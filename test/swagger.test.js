var meta = require('../package.json');
var test = require('./swagger-test');

test('getMetadata', function(test, client, done) {
  client.getMetadata({}, {}, function(response) {
    test.equal(response.obj.service, meta.name, 'service name');
    test.equal(response.obj.version, meta.version, 'service version');
    done();
  });
});
